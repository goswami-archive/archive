import fs from 'node:fs';
import { join, resolve } from 'node:path';

type TraverseFilesCallback = (fullPath: string) => Promise<void>;

export async function traverseFiles(
  path: string,
  callback: TraverseFilesCallback,
  extension?: string
) {
  const resolvedPath = resolve(process.cwd(), path);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Path ${resolvedPath} does not exist.`);
    process.exit(1);
  }

  await traverse(resolvedPath, callback, extension);
}

async function traverse(
  path: string,
  callback: TraverseFilesCallback,
  extension?: string
) {
  const stats = fs.statSync(path);

  if (stats.isFile()) {
    if (!extension) {
      await callback(path);
      return;
    } else if (path.endsWith(extension)) {
      await callback(path);
      return;
    }
  }

  if (stats.isDirectory()) {
    const files = fs.readdirSync(path);

    for (const file of files) {
      const fullPath = join(path, file);
      await traverse(fullPath, callback, extension);
    }
  }
}
