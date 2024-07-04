const fs = require("fs");
const { join } = require("path");
// const { promisify } = require("util");

// const readdir = promisify(fs.readdir);

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

module.exports = {
  traverseFiles,
};
