export class Downloader {

  constructor(downloaders){
    this.downloaders = downloaders;
  }

  /**
   * @public
   * @param {string} url
   * @returns boolean
   */
  canDownload(url) {
    const downloader = this.getDownloader(url);
    return downloader ? downloader.canDownload(url) : false;
  }

  /**
   * @public
   * @param {string} url
   * @returns {Promise<{mtime: Date, size: number}>}
   */
  async getRemoteStats(url) {
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

  getDownloader(url) {
    const downloaders = this.downloaders.filter((downloader) => downloader.canDownload(url));
    return downloaders.length > 0 ? downloaders[0] : null;
  }
}
