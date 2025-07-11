import nodePath from 'node:path';
import { getRelativePath } from '#common/file-utils.ts';
import { traverseFiles } from '#common/traverseFiles.ts';
import {
  getMarkdownContent,
  type Markdown,
} from '#common/markdown/markdown.ts';

/**
 * @param path - Path to search
 * @param propertyValues - Property values to search
 */
export function search(path: string, propertyValues: string[]) {
  const criteria = getSearchCriteria(propertyValues);
  const absPath = nodePath.resolve(process.cwd(), path);

  const results: string[] = [];

  traverseFiles(
    absPath,
    async (filePath) => {
      const markdown = getMarkdownContent(filePath);
      const found = testCriteria(markdown, criteria);
      if (found) {
        results.push(getRelativePath(filePath));
      }
    },
    '.md'
  ).then(() => {
    console.log(`Found ${results.length} results.`);
    results.forEach((result) => console.log(result));
  });
}

function testCriteria(markdown: Markdown, criteria: Record<string, string>) {
  const mergedData = { ...markdown.frontMatter };
  mergedData.content = markdown.content;

  for (const field in criteria) {
    if (!mergedData[field]) {
      return false;
    }

    const query = String(criteria[field]).toLowerCase().trim();
    const fieldValue = stringifyValue(mergedData[field]).toLowerCase().trim();

    if (query === '') {
      return fieldValue === '';
    } else {
      return fieldValue.includes(query);
    }
  }

  return true;
}

function stringifyValue(value: any) {
  if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'number') {
    return String(value);
  } else if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  } else if (Array.isArray(value)) {
    return value.join(',');
  } else {
    return '';
  }
}

/**
 * Split property values into key-value pairs
 */
function getSearchCriteria(propertyValues: string[]): Record<string, any> {
  const criteria: Record<string, any> = {};
  propertyValues.forEach((propertyValue) => {
    const [key, value] = propertyValue.split('=');
    criteria[key] = value;
  });

  return criteria;
}
