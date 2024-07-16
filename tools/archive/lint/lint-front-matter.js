import { getMarkdownContent } from "#common/markdown/markdown.js";
import { validate } from "./joi/validate.js";

/**
 * @param {string} file - file path
 * @returns {string[]} error messages
 */
function lintFrontMatter(file) {
  const { frontMatter } = getMarkdownContent(file);

  return validate(frontMatter);
}

export { lintFrontMatter };
