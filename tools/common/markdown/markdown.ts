import fs from 'node:fs';
import grayMatter from 'gray-matter';
import nunjucks from 'nunjucks';

export type Markdown = {
  frontMatter: Record<string, any>;
  content: string;
};

const templates = {
  baseDir: 'tools/common/markdown/template',
  post: 'post.njk',
  category: 'category.njk',
};

nunjucks.configure(templates.baseDir, {
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true,
});

function getMarkdownContent(file: string): Markdown {
  const { data, content } = grayMatter.read(file, { language: 'yaml' });

  return {
    frontMatter: data,
    content,
  };
}

function writePost(file: string, markdown: Markdown) {
  const result = render(templates.post, markdown);
  fs.writeFileSync(file, result);
}

function writeCategory(file: string, markdown: Markdown) {
  const result = render(templates.category, markdown);
  fs.writeFileSync(file, result);
}

function render(template: string, markdown: Markdown) {
  const { frontMatter, content } = markdown;
  return nunjucks.render(template, { ...frontMatter, content });
}

export { getMarkdownContent, writePost, writeCategory };
