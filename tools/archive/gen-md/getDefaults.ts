import { slugify } from '#common/slugify.ts';
import { getMediaTags, type PathInfo } from '#common/file-utils.js';
import { parseDirName, parseFileName } from '#common/regex.js';

const DEFAULTS = {
  lang: 'en',
  title: 'New Post',
  authors: {
    en: 'Bhakti Sudhir Goswami',
    ru: 'Бхакти Судхир Госвами',
  },
  draft: true,
  license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
};

async function getDefaults(pathInfo: PathInfo) {
  const { isDir, extension } = pathInfo;
  let defaults = {};

  if (isDir) {
    defaults = getDefaultsFromDir(pathInfo);
  } else if (extension === '.mp3') {
    defaults = await getDefaultsFromAudio(pathInfo);
  } else {
    defaults = getDefaultsFromMd(pathInfo);
  }

  return { ...DEFAULTS, ...defaults };
}

function getDefaultsFromDir(pathInfo: PathInfo) {
  return parseDirName(pathInfo.dirName);
}

function getDefaultsFromMd(pathInfo: PathInfo) {
  return {
    ...parseFileName(pathInfo.fileName),
    slug: slugify(pathInfo.fileName),
  };
}

async function getDefaultsFromAudio(pathInfo: PathInfo) {
  const { fileName, path } = pathInfo;
  const { lang, date, part, title } = parseFileName(fileName);
  const slug = slugify(fileName);
  const tags = await getMediaTags(path);

  const defaults = {
    title: tags.title ?? title,
    slug,
    lyrics: tags.lyrics,
  };

  if (lang) {
    defaults.lang = lang;
  }

  if (date) {
    defaults.date = date;
  }

  if (part) {
    defaults.part = part;
  }

  return defaults;
}

export { getDefaults };
