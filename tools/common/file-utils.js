import fs from "node:fs";
import nodePath from "node:path";
import { parseFile } from "music-metadata";

export function getPathInfo(path) {
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

/**
 * @param {string} fileName
 * @returns {string}
 */
export function titleFromFileName(fileName) {
  return fileName
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

/**
 * @param {string} file
 * @returns {Promise<Object>}
 */
export async function getMp3Metadata(file) {
  let metaData = {};
  try {
    metaData = await parseFile(file, { skipCovers: true });
  } catch (error) {
    console.error(error.message);
  }

  const meta = {
    duration: metaData.format.duration,
    bitrate: metaData.format.bitrate,
    sampleRate: metaData.format.sampleRate,
    numberOfChannels: metaData.format.numberOfChannels,
    tags: metaData.common,
  };

  return meta;
}

function removeDate(string) {
  return string.replace(/\d{4}-\d{2}-\d{2}/, "").trim();
}

/**
 * @param {string} path
 * @returns {boolean}
 */
export function isLocalFile(path) {
  return !path.includes("://");
}

/**
 * Get file path relative to archive root
 * @param {string} absPath
 * @returns
 */
export function getRelativePath(absPath) {
  return absPath.replace(process.cwd() + "/", "");
}


// export async function getMediaTags(audioPath) {
//   return new Promise((resolve, reject) => {
//     new mediaTags.Reader(audioPath).setTagsToRead(["title", "lyrics"]).read({
//       onSuccess: (id3v2) => {
//         resolve({
//           title: removeDate(id3v2.tags.title), // often title contains date
//           lyrics: id3v2.tags.lyrics ? id3v2.tags.lyrics.lyrics : "",
//         });
//       },
//       onError: (error) => {
//         reject(error);
//       },
//     });
//   });
// }
