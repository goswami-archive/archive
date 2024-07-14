import fs from "node:fs";
import nodePath from "node:path";
import mediaTags from "jsmediatags";

function getPathInfo(path) {
  const stat = fs.statSync(path);
  const isDir = stat.isDirectory();

  const { base, name, ext, dir } = nodePath.parse(path);

  return {
    isDir,
    path: path,
    baseName: base, // with extension
    fileName: name,
    extension: ext,
    dirName: dir,
  };
}

function titleFromFileName(filename) {
  return filename
    .split("_")
    .map((word) => {
      // naive check to not uppercase adverbs
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
  return absPath.replace(process.cwd() + "/", "");
}

export { getPathInfo, titleFromFileName, getMediaTags, getRelativePath };
