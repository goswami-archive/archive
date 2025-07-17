import fs from 'node:fs';
import grayMatter from 'gray-matter';
import nunjucks from 'nunjucks';

export type Markdown<T> = {
  frontMatter: T;
  content: string;
};

export interface BaseFrontMatter {
  type: string;
  lang: string;
  title: string;
  authors: string[];
  description: string;
  slug: string;
  image: {
    desktop: string;
    mobile?: string;
    alt: string;
  };
}

export interface CategoryMatter extends BaseFrontMatter {
  type: 'category';
}

export interface PostMatter extends BaseFrontMatter {
  type: 'post';
  authors: string[];
  date: string;
  audio: AudioMatter;
  duration: string;
  draft: boolean;
  license: string;
  location: string;
  tags: string[];
}

export type AudioMatter =
  | string
  | {
      file: string;
      [key: string]: string;
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

export function getMarkdownContent<T>(file: string): Markdown<T> {
  const { data, content } = grayMatter.read(file, { language: 'yaml' });

  return {
    frontMatter: data as T,
    content,
  };
}

export function writePost(file: string, markdown: Markdown<PostMatter>) {
  const result = render(templates.post, markdown);
  fs.writeFileSync(file, result);
}

export function writeCategory(
  file: string,
  markdown: Markdown<CategoryMatter>
) {
  const result = render(templates.category, markdown);
  fs.writeFileSync(file, result);
}

function render(template: string, markdown: Markdown<any>) {
  const { frontMatter, content } = markdown;
  return nunjucks.render(template, { ...frontMatter, content });
}

export function updatePostMatterValue(
  file: string,
  key: keyof PostMatter,
  value: any
) {
  const markdown = getMarkdownContent<PostMatter>(file);
  const { frontMatter } = markdown;
  const newMarkdown = {
    frontMatter: { ...frontMatter, [key]: value },
    content: markdown.content.trim(),
  };

  writePost(file, newMarkdown);
}
