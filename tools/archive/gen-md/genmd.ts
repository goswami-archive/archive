// find . -type f -name "*.md" -mmin -10 -exec rm -f {} \;
import fs from 'node:fs';
import nodePath from 'node:path';
import nodePlop from 'node-plop';
import { slugify } from '#common/slugify.ts';
import { parseFileName } from '#common/regex.ts';
import {
  getMp3Metadata,
  titleFromFileName,
  getMediaTags,
} from '#common/file-utils.ts';
import { traverseFiles } from '#common/traverseFiles.ts';
import { writePost } from '#common/markdown/markdown.ts';
import { formatDuration } from '#common/formatDuration.ts';
import { processContent } from './processContent.ts';

const PLOP_FILE = '/tools/archive/gen-md/plop/plopfile.ts';

let scriptOptions: GenmdOptions = {
  langs: ['en'],
  auto: false,
  force: false,
};

type GenmdOptions = {
  langs: string[];
  auto?: boolean;
  force?: boolean;
};

function genmd(path: string, options: GenmdOptions) {
  scriptOptions = { ...scriptOptions, ...options };

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

async function runPlop() {
  const configPath = nodePath.join(process.cwd(), PLOP_FILE);
  const plop = await nodePlop(configPath);
  const generator = plop.getGenerator('markdown');

  try {
    const results = await generator.runPrompts().then(generator.runActions);
    console.log('Plop generation complete:', results);
  } catch (error) {
    console.error('Error running Plop:', error);
  }
}

async function genmdFromFile(file: string) {
  if (!fs.existsSync(file)) {
    console.error(`File ${file} does not exist.`);
    process.exit(1);
  }

  scriptOptions.langs.forEach(async (lang) => {
    await createMarkdown(file, lang);
  });
}

function genmdFromPath(path: string) {
  if (!fs.existsSync(path)) {
    console.error(`Path ${path} does not exist.`);
    process.exit(1);
  }

  traverseFiles(
    path,
    async (file) => {
      scriptOptions.langs.forEach((lang) => {
        createMarkdown(file, lang);
      });
    },
    'mp3'
  );
}

async function createMarkdown(mp3Path: string, lang: string) {
  const mdPath = getNewFilePath(mp3Path, lang);
  if (fs.existsSync(mdPath) && !scriptOptions.force) {
    return;
  }

  const content = await getMarkdownContent(mp3Path, lang);
  writePost(mdPath, content);
}

function getNewFilePath(mp3Path: string, lang: string): string {
  const { lang: langInFileName } = parseFileName(
    nodePath.basename(mp3Path, '.mp3')
  );

  let mdPath = mp3Path;
  if (!langInFileName) {
    const fileName = nodePath.basename(mp3Path);
    mdPath = mdPath.replace(fileName, `${lang}_${fileName}`);
  }
  mdPath = mdPath.replace(/\.mp3$/, '.md');

  return mdPath;
}

async function getMarkdownContent(mp3Path: string, lang: string) {
  const fileName = nodePath.basename(mp3Path, '.mp3');
  const { lang: parsedLang, date, title: fileTitle } = parseFileName(fileName);
  let tags = await getMediaTags(mp3Path);
  const title = removeDate(tags.title || titleFromFileName(fileTitle));
  const finalLang = parsedLang || lang || 'en';
  const slug = slugify(parsedLang ? fileName : `${finalLang}_` + fileName);

  const audioData = await getMp3Metadata(mp3Path);
  const duration = audioData.duration
    ? formatDuration(audioData.duration)
    : undefined;

  const finalDate = date || tags.date || tags.year;

  const content = processContent(tags.lyrics);

  return {
    frontMatter: {
      lang: finalLang,
      title,
      authors: [
        lang === 'ru' ? 'Бхакти Судхир Госвами' : 'Bhakti Sudhir Goswami',
      ],
      date: finalDate,
      audio: {
        file: fileName + '.mp3',
      },
      duration,
      draft: true,
      slug,
      license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    content,
  };
}

function removeDate(string: string): string {
  return string.replace(/\d{4}-\d{2}-\d{2}/, '').trim();
}

export { genmd };
