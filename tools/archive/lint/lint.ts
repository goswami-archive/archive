import fs from 'node:fs';
import nodePath from 'node:path';
import { globSync } from 'glob';
import { lintContent } from './lintContent.ts';
import { lintFrontMatter } from './lintFrontMatter.ts';
import { getRelativePath } from '#common/file-utils.ts';

type LintOptions = {
  files: string[];
  path: string;
};

export function lint({ files, path }: LintOptions) {
  const filePaths = getFiles(files, path);

  let hasErrors = false;

  filePaths.forEach((file) => {
    const messages = [];
    messages.push(...lintFrontMatter(file));
    messages.push(...lintContent(file));

    if (messages.length > 0) {
      hasErrors = true;
      printMessages(getRelativePath(file), messages);
    }
  });

  if (hasErrors) {
    process.exit(1);
  }
}

function getFiles(files: string[], path: string): string[] {
  const validFiles = [];

  if (path) {
    return globSync(nodePath.resolve(process.cwd(), path) + '/**/*.md', {
      absolute: true,
    });
  }

  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.error(`File ${file} does not exist.`);
      continue;
    }
    if (fs.lstatSync(file).isDirectory()) {
      console.error(`File ${file} is a directory.`);
      continue;
    }
    if (!file.endsWith('.md')) {
      console.error(`File ${file} is not a markdown file.`);
      continue;
    }

    validFiles.push(file);
  }

  return validFiles;
}

function printMessages(file: string, messages: string[]) {
  messages.forEach((message) => {
    console.error(`${file} \t ${message}`);
  });
}
