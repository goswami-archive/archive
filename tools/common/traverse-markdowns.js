import { traverseFiles } from "./traverse-files.js";
import {getMarkdownContent} from "./markdown/markdown.js";

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
      const markdown = getMarkdownContent(filePath);
      callback(markdown, filePath);
    }
  });
}

export { traverseMarkdowns };
