import fs from 'node:fs';
import nodePath from 'node:path';
import axios from 'axios';
import ProgressBar from 'progress';
import {
  type DownloaderInterface,
  type RemoteStats,
} from './DownloaderInterface.ts';

export class DirectLinkDownloader implements DownloaderInterface {
  public canDownload(url: string): boolean {
    return url.endsWith('.mp3');
  }

  public async getRemoteStats(url: string): Promise<RemoteStats> {
    const response = await axios.head(url);
    const { headers } = response;

    return {
      mtime: new Date(headers['last-modified']),
      size: parseInt(headers['content-length'], 10),
    };
  }

  public async download(url: string, localPath: string): Promise<void> {
    const fileName = nodePath.basename(localPath);
    try {
      const { data, headers } = await axios({
        url: url,
        method: 'GET',
        responseType: 'stream',
      });

      const totalLength = headers['content-length'];
      const progressBar = new ProgressBar(`:percent\t${fileName}`, {
        width: 30,
        complete: '=',
        incomplete: ' ',
        renderThrottle: 1,
        total: parseInt(totalLength),
      });

      const tmpPath = localPath + '.tmp';

      const writer = fs.createWriteStream(tmpPath);
      data.on('data', (chunk) => {
        progressBar.tick(chunk.length);
      });
      data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          fs.renameSync(tmpPath, localPath);
          resolve();
        });
        writer.on('error', () => {
          fs.unlinkSync(tmpPath);
          reject();
        });
      });
    } catch (error) {
      fs.unlinkSync(tmpPath);
      console.error(`Error downloading file ${fileName}:`, error.message);
    }
  }
}
