#!/usr/bin/env node
import { program, Option } from 'commander';
import { upload } from './upload/upload.ts';

program
  .name('ia')
  .description('CLI tool for working with Internet Archive')
  .version('0.1.0');

program
  .command('upload')
  .description('upload audio file to Internet Archive')
  .argument('[files...]', 'List of files to upload')
  .option('-c, --config <file>', 'IA config file')
  .action((files: string[], options) => {
    upload(files, options);
  });

program.parse();
