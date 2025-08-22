#!/usr/bin/env node
import { program } from 'commander';
import { migrate } from './migrate.ts';

program
  .name('md-migrate')
  .description('Migrate markdown files to new format')
  .version('1.0.0')
  .argument('<path>', 'path to markdown file or folder')
  .action((path: string) => {
    migrate(path);
  });

program.parse();
