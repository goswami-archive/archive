// find . -type f -name "*.md" -mmin -10 -exec rm -f {} \;
import fs from "node:fs";
import nodePath from "node:path";
import { Plop, run } from "plop";
import { slugify } from "#common/slugify.js";
import { FILE_NAME_REGEX, parseFileName } from "#common/regex.js";
import {
  getMp3Metadata,
  titleFromFileName,
  getPathInfo,
} from "#common/file-utils.js";
import { traverseFiles } from "#common/traverse-files.js";
import { writePost } from "#common/markdown/markdown.js";
import { formatDuration } from "#common/format-duration.js";

let scriptOptions = {};

function genmd(path, options) {
  scriptOptions = { ...options };
  scriptOptions.langs = scriptOptions.langs || ["en"];

  const resolvedPath = nodePath.resolve(process.cwd(), path);

  if (fs.statSync(resolvedPath).isDirectory()) {
    genmdFromPath(resolvedPath);
  } else {
    if (scriptOptions.auto) {
      genmdFromFile(resolvedPath);
    } else {
      runPlop();
    }
  }
}

function runPlop() {
  const cwd = process.cwd();
  const configPath = nodePath.join(
    cwd,
    "/tools/archive/gen-md/plop/plopfile.js"
  );
  Plop.execute(
    {
      preload: [],
      cwd: process.cwd(),
      configPath,
    },
    run
  );
}

/**
 * @param {string} file
 */
async function genmdFromFile(file) {
  if (!fs.existsSync(file)) {
    console.error(`File ${file} does not exist.`);
    process.exit(1);
  }

  scriptOptions.langs.forEach(async (lang) => {
    await createMarkdown(file, lang);
  });
}

/**
 * @param {string} path
 */
function genmdFromPath(path) {
  if (!fs.existsSync(path)) {
    console.error(`Path ${path} does not exist.`);
    process.exit(1);
  }

  traverseFiles(path, async (file) => {
    scriptOptions.langs.forEach(async (lang) => {
      await createMarkdown(file, lang);
    });
  });
}

async function createMarkdown(mp3Path, lang) {
  const { fileName, extension } = getPathInfo(mp3Path);
  if (extension !== ".mp3" || !fileName.match(FILE_NAME_REGEX)) {
    return;
  }

  const mdPath = getNewFilePath(mp3Path, lang);
  if (fs.existsSync(mdPath) && !scriptOptions.force) {
    return;
  }

  const content = await getMarkdownContent(mp3Path, lang);
  writePost(mdPath, content);
}

/**
 * @param {string} mp3Path
 * @param {string} lang
 * @returns {string}
 */
function getNewFilePath(mp3Path, lang) {
  const { lang: langInFileName } = parseFileName(
    nodePath.basename(mp3Path, ".mp3")
  );
  let mdPath = mp3Path;
  if (!langInFileName) {
    const fileName = nodePath.basename(mp3Path);
    mdPath = mdPath.replace(fileName, `${lang}_${fileName}`);
  }
  mdPath = mdPath.replace(/\.mp3$/, ".md");

  return mdPath;
}

/**
 * @param {string} mp3Path
 * @param {string} lang
 * @returns {Promise<string>}
 */
async function getMarkdownContent(mp3Path, lang) {
  const fileName = nodePath.basename(mp3Path, ".mp3");
  const { lang: parsedLang, date, title: fileTitle } = parseFileName(fileName);
  let metaData = await getMp3Metadata(mp3Path);
  const title = metaData.tags.title || titleFromFileName(fileTitle);
  const finalLang = lang || parsedLang || "en";
  const slug = slugify(parsedLang ? fileName : `${finalLang}_` + fileName);
  const duration = formatDuration(metaData.duration);
  const finalDate = date || metaData.tags.date || metaData.tags.year;

  return {
    frontMatter: {
      lang: finalLang,
      title,
      authors: [
        lang === "ru" ? "Бхакти Судхир Госвами" : "Bhakti Sudhir Goswami",
      ],
      date: finalDate,
      audio: fileName + ".mp3",
      duration,
      draft: true,
      slug,
    },
    content: metaData.tags.lyrics,
  };
  // const templ = [];
  // templ.push("---");
  // templ.push("type: post");
  // templ.push(`lang: ${finalLang}`);
  // templ.push(`title: "${title}"`);
  // templ.push("authors:");
  // templ.push(
  //   `  - ${lang === "ru" ? "Бхакти Судхир Госвами" : "Bhakti Sudhir Goswami"}`
  // );
  // if (date) {
  //   templ.push(`date: ${date}`);
  // }
  // templ.push(`audio: ${fileName + ".mp3"}`);
  // templ.push("draft: true");
  // templ.push(`slug: ${slug}`);
  // templ.push("---");
  // templ.push("");
  // templ.push(lyrics);

  // return templ.join("\n");
}

export { genmd };
