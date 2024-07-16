import cheerio from "cheerio";
import allowedTags from "./allowed-tags.js";
import { getMarkdownContent } from "#common/markdown/markdown.js";

/**
 * @param {string} file path to file
 * @returns {string[]} error messages if any
 */
function lintContent(file) {
  const messages = [];
  const { content } = getMarkdownContent(file);
  const $ = cheerio.load(content, null, false);

  $("*").each((index, element) => {
    const tagName = element.tagName;

    if (!allowedTags.includes(tagName)) {
      messages.push(`Tag <${tagName}> not allowed in content.`);
    }
  });

  return messages;
}

export { lintContent };
