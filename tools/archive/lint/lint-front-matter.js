import revalidator from "revalidator";
import categorySchema from "./schema/front-matter/category.js";
import postSchema from "./schema/front-matter/post.js";
import { getMarkdownContent } from "#common/markdown/markdown.js";

/**
 * @param {string} file - file path
 * @returns {string[]} error messages
 */
function lintFrontMatter(file) {
  const messages = [];
  const { frontMatter } = getMarkdownContent(file);
  const schema = frontMatter.type === "post" ? postSchema : categorySchema;

  const { valid, errors } = revalidator.validate(frontMatter, schema, {
    additionalProperties: false,
  });

  if (!valid) {
    errors.forEach(({ property, message }) => {
      messages.push(`Property '${property}' ${message}`);
    });
  }

  return messages;
}

export { lintFrontMatter };
