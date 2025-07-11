import fs from 'node:fs';
import { join } from 'node:path';

type TraverseFilesCallback = (fullPath: string) => Promise<void>;

async function traverseFiles(
  path: string,
  callback: TraverseFilesCallback,
  extension?: string
) {
  const files = fs.readdirSync(path);

  for (const file of files) {
    const fullPath = join(path, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      await traverseFiles(fullPath, callback, extension);
    } else {
      if (!extension) {
        await callback(fullPath);
      } else if (fullPath.endsWith(extension)) {
        await callback(fullPath);
      }
    }
  }
}

export { traverseFiles };
