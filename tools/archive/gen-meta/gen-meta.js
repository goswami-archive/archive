import nodePath from "node:path";
import fs from "node:fs";
import yaml from "js-yaml";
import { traverseFiles } from "../../common/traverse-files.js";
import { parseFile } from "music-metadata";

function genMeta(path) {
  const resolvedPath = nodePath.resolve(process.cwd(), path);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Path ${resolvedPath} does not exist.`);
    process.exit(1);
  }

  traverseFiles(resolvedPath, async (file) => {
    if (file.endsWith(".mp3")) {
      await createMetaYaml(file);
    }
  });
}

async function createMetaYaml(mp3Path) {
  const metaPath = mp3Path.replace(/\.mp3$/, ".meta.yaml");

  const metadata = await getMediaMetadata(mp3Path);
  const content = yaml.dump(metadata, {
    quotingType: '"',
    forceQuotes: true
  });

  fs.writeFile(metaPath, content, (err) => {});
}

async function getMediaMetadata(file) {
  if (file.endsWith(".mp3")) {
    return getMp3Metadata(file);
  }

  return {};
}

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
