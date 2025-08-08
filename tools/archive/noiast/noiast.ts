import {
  getMarkdownContent,
  type PostMatter,
  writePost,
} from '#common/markdown/markdown.ts';
import { simplifyIast } from '#common/text/simplifyIast.ts';
import { traverseFiles } from '#common/traverseFiles.ts';

export function noiast(path: string) {
  traverseFiles(
    path,
    async (filePath) => {
      await processContent(filePath);
    },
    '.md'
  );
}

async function processContent(mdPath: string) {
  const { frontMatter, content } = getMarkdownContent<PostMatter>(mdPath);

  if (frontMatter.type !== 'post') {
    return;
  }

  const simplifiedContent = await simplifyIast(content);

  writePost(mdPath, {
    frontMatter,
    content: simplifiedContent,
  });
}
