// find . -type f -name "*.md" -mmin -10 -exec rm -f {} \;
import fs from "node:fs";
import pathModule from "node:path";
import { slugify } from "../../common/slugify.js";
import { FILE_NAME_REGEX, parseFileName } from "../../common/regex.js";
import {
  getMediaTags,
  titleFromFileName,
  getPathInfo,
} from "../../common/file-utis.js";
import { traverseFiles } from "../../common/traverse-files.js";

let scriptOptions = {};

function genmd(path, options) {
  scriptOptions = { ...options };
  scriptOptions.langs = scriptOptions.langs || ["en"];

  const resolvedPath = pathModule.resolve(process.cwd(), path);

  if (fs.statSync(resolvedPath).isDirectory()) {
    genmdFromPath(resolvedPath);
  } else {
    if (scriptOptions.auto) {
      runPlop();
    } else {
      genmdFromFile(resolvedPath);
    }
  }
}

async function runPlop() {}

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
  if (fs.existsSync(mdPath)) {
    return;
  }

  const content = await getMarkdownContent(mp3Path, lang);
  fs.writeFile(mdPath, content, (err) => {});
}

function getNewFilePath(mp3Path, lang) {
  const { lang: langInFileName } = parseFileName(
    pathModule.basename(mp3Path, ".mp3")
  );
  let mdPath = mp3Path;
  if (!langInFileName) {
    const fileName = pathModule.basename(mp3Path);
    mdPath = mdPath.replace(fileName, `${lang}_${fileName}`);
  }
  mdPath = mdPath.replace(/\.mp3$/, ".md");

  return mdPath;
}

async function getMarkdownContent(mp3Path, lang) {
  const fileName = pathModule.basename(mp3Path, ".mp3");
  const { lang: parsedLang, date, title: fileTitle } = parseFileName(fileName);
  let { title: id3Title, lyrics } = await getMediaTags(mp3Path);
  const title = id3Title || titleFromFileName(fileTitle);
  const finalLang = lang || parsedLang || "en";
  const slug = slugify(parsedLang ? fileName : `${finalLang}_` + fileName);

  const templ = [];
  templ.push("---");
  templ.push("type: post");
  templ.push(`lang: ${finalLang}`);
  templ.push(`title: "${title}"`);
  templ.push("authors:");
  templ.push(
    `  - ${lang === "ru" ? "Бхакти Судхир Госвами" : "Bhakti Sudhir Goswami"}`
  );
  if (date) {
    templ.push(`date: ${date}`);
  }
  templ.push(`audio: ${fileName + ".mp3"}`);
  templ.push("draft: true");
  templ.push(`slug: ${slug}`);
  templ.push("---");
  templ.push("");
  templ.push(lyrics);

  return templ.join("\n");
}

export { genmd };