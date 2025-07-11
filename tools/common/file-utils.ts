import fs from 'node:fs';
import nodePath from 'node:path';
import { parseFile } from 'music-metadata';
import mediaTags from 'jsmediatags';

export type PathInfo = {
  isDir: boolean;
  path: string;
  baseName: string;
  fileName: string;
  extension: string;
  dirName: string;
};

export function getPathInfo(path: string): PathInfo {
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

export function titleFromFileName(fileName: string): string {
  return fileName
    .split('_')
    .map((word) => {
      // naive check to not uppercase adverbs
      if ([1, 2].includes(word.length)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export async function getMp3Metadata(file: string) {
  const metaData = await parseFile(file, { skipCovers: true });

  const meta = {
    duration: metaData.format.duration,
    bitrate: metaData.format.bitrate,
    sampleRate: metaData.format.sampleRate,
    numberOfChannels: metaData.format.numberOfChannels,
    tags: metaData.common,
  };

  return meta;
}

export function isLocalFile(path: string): boolean {
  return !path.includes('://');
}

export function getRelativePath(absPath: string): string {
  return absPath.replace(process.cwd() + '/', '');
}

export type MediaTags = {
  title: string;
  lyrics: string;
  date: string;
  year: string;
};

export async function getMediaTags(audioPath: string): Promise<MediaTags> {
  const tags = ['title', 'date', 'year', 'lyrics'];

  return new Promise((resolve, reject) => {
    new mediaTags.Reader(audioPath).setTagsToRead(tags).read({
      onSuccess: (id3v2) => {
        resolve({
          title: id3v2.tags.title ?? '',
          lyrics: id3v2.tags.lyrics ? id3v2.tags.lyrics.lyrics : '',
          date: id3v2.tags.date ?? '',
          year: id3v2.tags.year ?? '',
        });
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
}
