import {
  getMarkdownContent,
  type PostMatter,
  writePost,
} from '#common/markdown/markdown.ts';
import { traverseFiles } from '#common/traverseFiles.ts';
import { getTextProcessor } from './text-processor/getTextProcessor.ts';

export function smartEdit(path: string) {
  traverseFiles(
    path,
    async (filePath) => {
      processContent(filePath);
    },
    '.md'
  );
}

function processContent(mdPath: string) {
  const { frontMatter, content } = getMarkdownContent<PostMatter>(mdPath);

  if (frontMatter.type !== 'post') {
    return;
  }

  const textProcessor = getTextProcessor(frontMatter.lang);
  const result = textProcessor.process(content);

  writePost(mdPath, {
    frontMatter,
    content: result.processedText,
  });

  console.log(result.report);
}
