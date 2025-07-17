import {
  type BaseFrontMatter,
  getMarkdownContent,
  updatePostMatterValue,
} from '#common/markdown/markdown.ts';
import { keywords, summarize } from '#common/text/summarize.ts';
import { traverseFiles } from '#common/traverseFiles.ts';

export function genSeo(path: string) {
  traverseFiles(
    path,
    async (filePath) => {
      updateDescription(filePath);
    },
    '.md'
  );
}

async function updateDescription(mdPath: string) {
  const { frontMatter, content } = getMarkdownContent<BaseFrontMatter>(mdPath);

  if (frontMatter.type !== 'post') {
    return;
  }

  const summary = await summarize(content);
  updatePostMatterValue(mdPath, 'description', summary);

  // const tags = await keywords(content);
  // updatePostMatterValue(mdPath, 'tags', tags);
}
