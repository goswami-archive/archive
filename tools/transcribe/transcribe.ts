#!/usr/bin/env node
import { program } from 'commander';
import { transcribe } from './program/transcribe.ts';

program
  .name('transcribe')
  .description('Automatic text transcription based on markdown file')
  .version('1.0.0')
  .argument('<path>', 'path to markdown file')
  .option(
    '-p, --provider',
    'Provider to use for transcription (assemblyai, gladia. Default: assemblyai)'
  )
  .option(
    '-g, --gap',
    'Timestamps minimum gap in seconds. Lesser gap results more paragraphs (Default: 10)'
  )
  .option(
    '-t, --timestamps',
    'Include timestamps in transcription (Default: true)'
  )
  .action((file: string, options) => {
    transcribe(file, options);
  });

program.parse();
