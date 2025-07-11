import * as cheerio from 'cheerio';
import allowedTags from './allowed-tags.ts';
import { getMarkdownContent } from '#common/markdown/markdown.ts';

function lintContent(file: string): string[] {
  const messages: string[] = [];
  const { content } = getMarkdownContent(file);
  const $ = cheerio.load(content, null, false);

  $('*').each((index, element) => {
    const tagName = element.tagName;

    if (!allowedTags.includes(tagName)) {
      messages.push(`Tag <${tagName}> not allowed in content.`);
    }
  });

  return messages;
}

export { lintContent };
