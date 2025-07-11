export interface DownloaderInterface {
  canDownload(url: string): boolean;
  getRemoteStats(url: string): Promise<RemoteStats>;
  download(url: string, localPath: string): Promise<void>;
}

export type RemoteStats = {
  mtime: Date;
  size: number;
};
