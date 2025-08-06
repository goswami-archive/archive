#!/usr/bin/env node
import { program } from 'commander';
import { transcribe } from './program/transcribe.ts';

program
  .name('transcribe')
  .description('Automatic text transcription based on markdown file')
  .version('1.0.0')
  .argument('<path>', 'path to markdown file')
  .option(
    '-p, --provider <value>',
    'Provider to use for transcription (values: assemblyai, gladia)'
  )
  .option(
    '-g, --gap <number>',
    'Minimum gap between timestamps in seconds. Smaller gap results more paragraphs (Default: 10)'
  )
  .option(
    '-t, --timestamps',
    'Include timestamps in transcription (Default: true)'
  )
  .action((file: string, options) => {
    transcribe(file, options);
  });

program.parse();
