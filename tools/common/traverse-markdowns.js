import grayMatter from "gray-matter";
import { traverseFiles } from "./traverse-files.js";

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

export { traverseMarkdowns };
