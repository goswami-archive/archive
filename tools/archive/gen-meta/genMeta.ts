import nodePath from 'node:path';
import fs from 'node:fs';
import yaml from 'js-yaml';
import { parseFile } from 'music-metadata';
import { traverseFiles } from '#common/traverseFiles.ts';

/**
 * @typedef {Object} Mp3Metadata
 * @property {number} size
 * @property {number} modtime
 * @property {AudioMetadata} audio
 * @property {Id3v2Metadata} id3v2
 */

/**
 * @typedef {Object} Id3v2Metadata
 * @property {string} title
 * @property {string} artist
 * @property {string} album
 * @property {string} year
 */

/**
 * @typedef {Object} AudioMetadata
 * @property {number} duration
 * @property {number} bitrate
 * @property {number} sampleRate
 * @property {number} numberOfChannels
 */

/**
 * @param {string} path - path to directory or file
 */
function genMeta(path) {
  const resolvedPath = nodePath.resolve(process.cwd(), path);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Path ${resolvedPath} does not exist.`);
    process.exit(1);
  }

  traverseFiles(resolvedPath, async (file) => {
    if (file.endsWith('.mp3')) {
      await createMetaYaml(file);
    }
  });
}

/**
 * @param {string} mp3Path
 * @return {Promise<void>}
 */
async function createMetaYaml(mp3Path) {
  const yamlPath = mp3Path.replace(/\.mp3$/, '.meta.yaml');

  const metadata = await getMediaMetadata(mp3Path);
  const content = yaml.dump(metadata, {
    quotingType: '"',
    forceQuotes: true,
  });

  await fs.writeFile(yamlPath, content, (err) => {});
}

/**
 * @param {string} file
 * @returns {Promise<Object>}
 */
async function getMediaMetadata(file) {
  if (file.endsWith('.mp3')) {
    return getMp3Metadata(file);
  }

  return {};
}

/**
 * @param {string} file
 * @returns {Promise<Mp3Metadata>}
 */
async function getMp3Metadata(file) {
  let metaData = {};
  try {
    metaData = await parseFile(file, { skipCovers: true });
  } catch (error) {
    console.error(error.message);
  }

  const fsStats = fs.statSync(file);

  const meta = {
    size: fsStats.size,
    modtime: fsStats.mtime.getTime(),
    audio: {
      duration: metaData.format.duration,
      bitrate: metaData.format.bitrate,
      sampleRate: metaData.format.sampleRate,
      numberOfChannels: metaData.format.numberOfChannels,
    },
    id3v2: {
      title: metaData.common.title,
      artist: metaData.common.artist,
      album: metaData.common.album,
      year: metaData.common.year,
    },
  };

  return meta;
}

export { genMeta };
