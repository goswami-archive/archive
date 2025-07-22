#!/usr/bin/env node
import { program } from 'commander';
import { upload } from './command/upload.ts';
import { update } from './command/update.ts';

program
  .name('ia')
  .description('CLI tool for working with Internet Archive')
  .version('0.1.0');

program
  .command('upload')
  .description('Create item on Internet Archive from markdown file')
  .argument('[files...]', 'List of Markdown files')
  .option('-c, --config <file>', 'IA config file')
  .action((files: string[], options) => {
    upload(files, options);
  });

program
  .command('update')
  .description("Update IA item's data from markdown file")
  .argument('[files...]', 'List of Markdown files')
  .option('-c, --config <file>', 'IA config file')
  .action((files: string[], options) => {
    update(files, options);
  });

program.parse();
