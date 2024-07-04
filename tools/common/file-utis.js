const pathModule = require("path");
const fs = require("fs");
const mediaTags = require("jsmediatags");
const { FILE_NAME_REGEX, DIR_NAME_REGEX } = require("./regex");

function getPathInfo(path) {
  const stat = fs.statSync(path);
  const isDir = stat.isDirectory();

  const { base, name, ext, dir } = pathModule.parse(path);

  return {
    isDir,
    path: path,
    baseName: base, // with extension
    fileName: name,
    extension: ext,
    dirName: dir,
  };
}

function parseDirName(pathInfo) {
  const match = pathInfo.fileName.match(DIR_NAME_REGEX);

  return {
    date: match[1],
    part: match[2],
    title: titleFromFileName(match[3]),
  };
}

function parseFileName(fileName) {
  const match = fileName.match(FILE_NAME_REGEX);

  return {
    lang: match[1],
    date: match[2],
    part: match[3],
    title: titleFromFileName(match[4]),
  };
}

function titleFromFileName(filename) {
  return filename
    .split("_")
    .map((word) => {
      if ([1, 2].includes(word.length)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
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

/**
 * Get file path relative to archive root
 * @param {string} absPath
 * @returns
 */
function getRelativePath(absPath) {
  return absPath.replace(process.cwd(), "");
}

module.exports = {
  getPathInfo,
  parseDirName,
  parseFileName,
  getMediaTags,
  getRelativePath,
};
