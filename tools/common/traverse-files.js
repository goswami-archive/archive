import fs from "node:fs";
import { join } from "node:path";

/**
 * @typedef {Function} TraverseFilesCallback
 * @param {string} fullPath
 * @returns {void}
 */

/**
 * @param {string} path
 * @param {TraverseFilesCallback} callback
 * @param {string?} extension
 */
async function traverseFiles(path, callback, extension) {
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
