#!/usr/bin/env node
import { program, Option } from 'commander';
import { lint } from './lint/lint.ts';
import { fetch } from './fetch/fetch.ts';
import { search } from './search/search.ts';
import { genmd } from './gen-md/genmd.ts';
import { genMeta } from './gen-meta/genMeta.ts';
import { updateDuration } from './update-duration/updateDuration.ts';
import { genSeo } from './gen-seo/genSeo.ts';
import { smartEdit } from './smart-edit/smart-edit.ts';

program
  .name('archive')
  .description('CLI tool for archive management')
  .version('0.1.0');

program
  .command('lint')
  .description('Lint markdown files')
  .option('-f, --files [files...]', 'space separated list of files to validate')
  .addOption(
    new Option('-p, --path <path>', 'directory path to validate').conflicts(
      'files'
    )
  )
  .action((options) => {
    lint(options);
  });

program
  .command('fetch')
  .description('Download media referenced in markdown files')
  .option('-p, --path <path>', 'Path to scan for markdown files')
  .option('-f, --force', 'Rewrite local files that are newer than remote')
  .action((options) => {
    fetch(options);
  });

program
  .command('search')
  .description('Search throught markdown content')
  .arguments('<path> <property=value...>')
  .action((path, propertyValues) => {
    search(path, propertyValues);
  });

program
  .command('genmd')
  .description('Generate markdown files from media files')
  .argument('<path>', 'path to directory or media file')
  .option(
    '-l, --langs [langs...]',
    'space separated list of languages, used if language code is not present in file name (default: en)'
  )
  .option('-f, --force', 'Rewrite existing markdown files when using auto mode')
  .option(
    '-a, --auto',
    'When specifying media file, create markdowns without prompts'
  )
  .action((path, options) => {
    genmd(path, options);
  });

program
  .command('genmeta')
  .description('Generate or update media meta-information')
  .argument('<path>', 'path to directory with media files')
  .action((path) => {
    genMeta(path);
  });

program
  .command('update-duration')
  .description('Update duration field in markdown files')
  .argument('<path>', 'path to markdown file or directory')
  .action((path) => {
    updateDuration(path);
  });

program
  .command('gen-seo')
  .description('Generate SEO description for markdown files')
  .argument('<path>', 'path to markdown file or directory')
  .action((path) => {
    genSeo(path);
  });

program
  .command('smart-edit')
  .description('Automatically fix text formatting in markdown files')
  .argument('<path>', 'path to markdown file or directory')
  .action((path) => {
    smartEdit(path);
  });

program
  .command('report')
  .description("Generate archive's content report")
  .action((options) => {
    // TODO: Implement
  });

program.parse();
