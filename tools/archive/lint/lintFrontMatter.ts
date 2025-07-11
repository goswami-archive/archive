import { getMarkdownContent } from '#common/markdown/markdown.ts';
import { validate } from './joi/validate.ts';

function lintFrontMatter(file: string): string[] {
  const { frontMatter } = getMarkdownContent(file);

  return validate(frontMatter);
}

export { lintFrontMatter };
