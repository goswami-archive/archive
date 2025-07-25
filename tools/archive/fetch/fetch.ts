import fs from 'node:fs';
import nodePath from 'node:path';
import { traverseFiles } from '#common/traverseFiles.ts';
import { formatSize } from '#common/formatSize.ts';
import { isLocalFile } from '#common/file-utils.ts';
import { getMarkdownContent } from '#common/markdown/markdown.ts';
import { DirectLinkDownloader } from './downloader/DirectLinkDownloader.ts';
import { Downloader } from './downloader/Downloader.ts';

type FileInfo = {
  src: string;
  dest: string;
  size: number;
};

type Stats = {
  totalFiles: number;
  totalDownloadSize: number;
  downloadedFiles: number;
  notDownloadedFiles: number;
  outdatedFiles: number;
};

const downloader = new Downloader([new DirectLinkDownloader()]);

const filesToUpdate: FileInfo[] = [];
const filesToDownload: FileInfo[] = [];

const stats: Stats = {
  totalFiles: 0,
  totalDownloadSize: 0,
  downloadedFiles: 0,
  notDownloadedFiles: 0,
  outdatedFiles: 0,
};

export async function fetch({ path }) {
  console.log('Collecting stats...');
  const absPath = nodePath.resolve(process.cwd(), path);
  // await scanDirectory(absPath);

  await traverseFiles(
    absPath,
    async (file) => {
      if (file.endsWith('.md')) {
        await processMarkdownFile(file);
      }
    },
    'md'
  );

  showStats(stats);

  // if (filesToUpdate.length) {
  //   await updateFiles(filesToUpdate);
  // }

  if (filesToDownload.length) {
    await downloadFiles(filesToDownload);
  }
}

function showStats(stats: Stats) {
  const downloadSize =
    filesToUpdate.reduce((acc, file) => acc + file.size, 0) +
    filesToDownload.reduce((acc, file) => acc + file.size, 0);

  console.table({
    'Total audio files': stats.totalFiles,
    Downloaded: stats.downloadedFiles,
    New: filesToDownload.length,
    Outdated: filesToUpdate.length,
    'Total download size': formatSize(downloadSize),
  });

  // const tableData = {}
  // filesToDownload.forEach(fileInfo => {
  //   tableData[fileInfo.dest] = fileInfo.size;
  // });
  // console.table(tableData);
}

// async function scanDirectory(directory) {
//   const files = await readdir(directory);

//   for (const file of files) {
//     const fullPath = nodePath.join(directory, file);
//     const stats = fs.statSync(fullPath);

//     if (stats.isDirectory()) {
//       await scanDirectory(fullPath);
//     } else if (nodePath.extname(file) === ".md") {
//       await processMarkdownFile(fullPath);
//     }
//   }
// }

// async function collectStats(directory) {
//   const files = await readdir(directory);

//   for (const file of files) {
//     const fullPath = nodePath.join(directory, file);
//     const stats = fs.statSync(fullPath);

//     if (stats.isDirectory()) {
//       await collectStats(fullPath);
//     } else if (nodePath.extname(file) === ".md") {
//       await processMarkdownFile(fullPath);
//     }
//   }
// }

// Total   Downloaded Not Downloaded Outdated
// 10           8           2            2
// Total download size: 10 MB

function getAudioUrl(mdFile) {
  const { frontMatter } = getMarkdownContent(mdFile);
  return frontMatter.audio || null;
}

async function processMarkdownFile(mdPath) {
  const audioUrl = getAudioUrl(mdPath);

  if (!audioUrl) {
    return;
  }

  ++stats.totalFiles;

  if (isLocalFile(audioUrl)) {
    stats.notDownloadedFiles++;
    return;
  }

  const localAudio = mdPath.replace('.md', '.mp3');
  await addForDownload(audioUrl, localAudio);
}

async function addForDownload(url: string, localPath: string) {
  if (!downloader.canDownload(url)) {
    console.warn(`Unable to process url ${url}`);
    return;
  }
  const remoteStats = await downloader.getRemoteStats(url);

  if (!fs.existsSync(localPath)) {
    filesToDownload.push({
      src: url,
      dest: localPath,
      size: remoteStats.size,
    });
    return;
  }

  const localStats = fs.statSync(localPath);
  if (
    remoteStats.mtime > localStats.mtime ||
    remoteStats.size !== localStats.size
  ) {
    filesToUpdate.push({ src: url, dest: localPath, size: remoteStats.size });
  } else {
    ++stats.downloadedFiles;
  }
}

async function updateFiles(files: FileInfo[]) {
  console.info(`--- Updating ${files.length} files ---`);
  for (const file of files) {
    await downloadFile(file.src, file.dest);
  }
}

async function downloadFiles(files: FileInfo[]) {
  console.info(`--- Downloading ${files.length} files ---`);
  for (const file of files) {
    await downloadFile(file.src, file.dest);
  }
}

async function downloadFile(url: string, localPath: string) {
  if (downloader.canDownload(url)) {
    await downloader.download(url, localPath);
  }
}

// const http = require('http');
// const fs = require('fs');

// const fileUrl = 'http://example.com/file.txt';
// const destination = 'downloaded_file.txt';

// const file = fs.createWriteStream(destination);

// http.get(fileUrl, (response) => {
//     response.pipe(file);
//     file.on('finish', () => {
//         file.close(() => {
//             console.log('File downloaded successfully');
//         });
//     });
// }).on('error', (err) => {
//     fs.unlink(destination, () => {
//         console.error('Error downloading file:', err);
//     });
// });
