const slugify = require("slugify");
const {
  parseDirName,
  parseFileName,
  getSlug,
  getMediaTags,
} = require("../common/file-utis");

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
  const info = parseFileName(fileName);
  const slug = getSlug(fileName);
  const { title, lyrics } = await getMediaTags(path);

  return {
    ...info,
    title: title ?? info.title,
    slug,
    lyrics,
  };
}

module.exports = {
  getDefaults,
};
