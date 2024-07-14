import fs from "node:fs";
import grayMatter from "gray-matter";
import nunjucks from "nunjucks";

const templates = {
  baseDir: "tools/common/markdown/template",
  post: "post.njk",
  category: "category.njk",
}

nunjucks.configure(templates.baseDir, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
});

/**
 * @typedef {Object} Markdown
 * @property {Object} frontMatter - Front matter
 * @property {string} content - Content
 */

/**
 * @param {string} file
 * @returns {Markdown}
 */
function getMarkdownContent(file) {
  const { data, content } = grayMatter.read(file, { language: "yaml" });

  return {
    frontMatter: data,
    content,
  };
}

/**
 * @param {string} file
 * @param {Markdown} data
 */
function writePost(file, markdown) {
  const result = render(templates.post, markdown);
  fs.writeFileSync(file, result);
}

/**
 * @param {string} file
 * @param {Markdown} data
 */
function writeCategory(file, markdown) {
  const result = render(templates.category, markdown);
  fs.writeFileSync(file, result);
}

/**
 * @param {string} template
 * @param {Markdown} markdown
 */
function render(template, markdown) {
  const { frontMatter, content } = markdown;
  return nunjucks.render(template, {...frontMatter, content });
}

export { getMarkdownContent, writePost, writeCategory };

// const data = {
//   frontMatter: {
//     title: "Hello World",
//     description: "This is a post",
//     date: "2022-01-01",
//     tags: ["foo", "bar"],
//   },
//   content: "Hello World"
// };

// writePost("test.md", data);
