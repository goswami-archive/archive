import { type DownloaderInterface } from './DownloaderInterface.ts';

export class Downloader {
  private downloaders: DownloaderInterface[];

  constructor(downloaders: DownloaderInterface[]) {
    this.downloaders = downloaders;
  }

  public canDownload(url: string): boolean {
    const downloader = this.getDownloader(url);
    return downloader ? downloader.canDownload(url) : false;
  }

  public async getRemoteStats(url: string) {
    return this.getDownloader(url).getRemoteStats(url);
  }

  /**
   * @public
   * @param {string} url
   * @param {string} localPath
   */
  async download(url, localPath) {
    return this.getDownloader(url).download(url, localPath);
  }

  private getDownloader(url: string): DownloaderInterface | null {
    const downloaders = this.downloaders.filter((downloader) =>
      downloader.canDownload(url)
    );
    return downloaders.length > 0 ? downloaders[0] : null;
  }
}
