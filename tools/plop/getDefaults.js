const mediaTags = require("jsmediatags");
const { FILE_NAME_REGEX, DIR_NAME_REGEX } = require("../common/regex");

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
  const match = pathInfo.fileName.match(DIR_NAME_REGEX);

  return {
    date: match[1],
    part: match[2],
    title: match[3].replace(/_/g, " "),
  };
}

function getDefaultsFromMd(pathInfo) {
  const { fileName } = pathInfo;
  const match = fileName.match(FILE_NAME_REGEX);
  const slug = getSlug(pathInfo);

  return {
    lang: match[1],
    date: match[2],
    part: match[3],
    title: match[4].replace(/_/g, " "),
    slug,
  };
}

async function getDefaultsFromAudio(pathInfo) {
  const { fileName, path } = pathInfo;
  const match = fileName.match(FILE_NAME_REGEX);

  const { title, lyrics } = await getMediaTags(path);
  const slug = getSlug(pathInfo);

  return {
    lang: match[1],
    date: match[2],
    part: match[3],
    title: title ?? match[4].replace(/_/g, " "),
    lyrics,
    slug,
  };
}

function getSlug(pathInfo) {
  const { fileName } = pathInfo;
  return fileName.replace(/_/g, "-").toLocaleLowerCase();
}

async function getMediaTags(audioPath) {
  return new Promise((resolve, reject) => {
    new mediaTags.Reader(audioPath).setTagsToRead(["title", "lyrics"]).read({
      onSuccess: (id3v2) => {
        resolve({
          title: id3v2.tags.title,
          lyrics: id3v2.tags.lyrics ? id3v2.tags.lyrics.lyrics : "",
        });
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
}

module.exports = {
  getDefaults,
};
