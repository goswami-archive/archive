import fs from "node:fs";
import { join } from "node:path";

/**
 * @param {string} path
 * @param {fn} callback
 */
function traverseFiles(path, callback) {
  const files = fs.readdirSync(path);

  for (const file of files) {
    const fullPath = join(path, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      traverseFiles(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

export { traverseFiles };
