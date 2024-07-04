const grayMatter = require("gray-matter");
const { traverseFiles } = require("./traverse-files");

/**
 * @typedef {Object} Markdown
 * @property {Object} frontMatter - Front matter
 * @property {string} content - Content
 */

/**
 * Traverse callback
 * @name TraverseMarkdownsCallback
 * @function
 * @param {Markdown} markdown - Markdown
 * @param {string} filePath - File path
 */

/**
 * @param {string} dir
 * @param {TraverseMarkdownsCallback} callback
 */
function traverseMarkdowns(dir, callback) {
  traverseFiles(dir, (filePath) => {
    if (filePath.endsWith(".md")) {
      const { data, content } = grayMatter.read(filePath, { language: "yaml" });
      callback({ frontMatter: data, content }, filePath);
    }
  });
}

module.exports = {
  traverseMarkdowns,
};
