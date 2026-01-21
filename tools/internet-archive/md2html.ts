#!/usr/bin/env node
import * as fs from 'node:fs';
import * as nodePath from 'node:path';
import { fileURLToPath } from 'node:url';
import { program } from 'commander';
import { md2html } from './md2html/md2html.ts';
import {
  getMarkdownContent,
  type PostMatter,
} from '#common/markdown/markdown.ts';

program
  .name('md2html')
  .description('')
  .version('1.0.0')
  .argument('<path>', 'path to markdown file')
  .action((file: string, options) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = nodePath.dirname(__filename);

    const { content } = getMarkdownContent<PostMatter>(file);

    const html = md2html(content);
    fs.writeFileSync(nodePath.join(__dirname, 'index.html'), html);
  });

program.parse();
