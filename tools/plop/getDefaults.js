import { slugify } from "../common/slugify.js";
import { getMediaTags } from "../common/file-utis.js";
import { parseDirName, parseFileName } from "../common/regex.js";

const DEFAULTS = {
  lang: "en",
  title: "New Post",
  authors: {
    en: "Bhakti Sudhir Goswami",
    ru: "Бхакти Судхир Госвами",
  },
  date: new Date().toISOString().split("T")[0],
  draft: true,
};

async function getDefaults(pathInfo) {
  const { isDir, extension } = pathInfo;
  let defaults = {};

  if (isDir) {
    defaults = getDefaultsFromDir(pathInfo);
  } else if (extension === ".mp3") {
    defaults = await getDefaultsFromAudio(pathInfo);
  } else {
    defaults = getDefaultsFromMd(pathInfo);
  }

  return { ...DEFAULTS, ...defaults };
}

function getDefaultsFromDir(pathInfo) {
  return parseDirName(pathInfo);
}

function getDefaultsFromMd(pathInfo) {
  return {
    ...parseFileName(pathInfo),
    slug: slugify(pathInfo.fileName),
  };
}

async function getDefaultsFromAudio(pathInfo) {
  const { fileName, path } = pathInfo;
  const { lang, date, part, title } = parseFileName(fileName);
  const slug = slugify(fileName);
  const { title: id3Title, lyrics } = await getMediaTags(path);

  const defaults = {
    title: id3Title ?? title,
    slug,
    lyrics,
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
