import {
  getMarkdownContent,
  writePost,
  type Markdown,
  type PostMatter,
} from '#common/markdown/markdown.ts';
import { traverseFiles } from '#common/traverseFiles.ts';

export function migrate(path: string) {
  traverseFiles(
    path,
    async (filePath) => {
      const markdown = getMarkdownContent<PostMatter>(filePath);
      if (markdown.frontMatter.type !== 'post') {
        return;
      }
      processMd(filePath, markdown);
    },
    '.md'
  );
}

/**
 * Migrate markdown file to new format
 */
function processMd(filePath: string, markdown: Markdown<PostMatter>) {
  const { frontMatter, content } = markdown;
  // frontMatter['license'] = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
  // frontMatter['audio'] = {
  //   file: frontMatter['audio'],
  // };
  // frontMatter['date'] = String(frontMatter['date']);
  frontMatter['status'] = 'draft';
  writePost(filePath, { frontMatter, content });
}
