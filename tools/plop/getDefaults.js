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
    title: titleFromFileName(match[3]),
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
    title: titleFromFileName(match[4]),
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
    title: title ?? titleFromFileName(match[4]),
    lyrics,
    slug,
  };
}

function titleFromFileName(filename) {
  return filename
    .split("_")
    .map((word) => {
      if ([1,2].includes(word.length)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ");
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
          title: removeDate(id3v2.tags.title), // often title contains date
          lyrics: id3v2.tags.lyrics ? id3v2.tags.lyrics.lyrics : "",
        });
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
}

function removeDate(string) {
  return string.replace(/\d{4}-\d{2}-\d{2}/, "").trim();
}

module.exports = {
  getDefaults,
};
