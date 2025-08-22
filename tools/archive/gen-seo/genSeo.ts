import {
  type BaseFrontMatter,
  getMarkdownContent,
  updatePostMatterValue,
} from '#common/markdown/markdown.ts';
import { summarize } from '#common/text/summarize.ts';
import { traverseFiles } from '#common/traverseFiles.ts';

interface GenSeoOptions {
  length?: number;
}

export function genSeo(path: string, { length }: GenSeoOptions) {
  traverseFiles(
    path,
    async (filePath) => {
      updateDescription(filePath, length);
    },
    '.md'
  );
}

async function updateDescription(mdPath: string, maxLength?: number) {
  const { frontMatter, content } = getMarkdownContent<BaseFrontMatter>(mdPath);

  if (frontMatter.type !== 'post') {
    return;
  }

  const summary = await summarize(frontMatter.lang, content, maxLength);
  updatePostMatterValue(mdPath, 'description', summary);
}
