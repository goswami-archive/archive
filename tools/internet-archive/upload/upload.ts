import nodePath from 'node:path';
import fs from 'node:fs';
import { spawn, spawnSync, exec } from 'node:child_process';
import { promisify } from 'node:util';
import { traverseFiles } from '#common/traverseFiles.ts';
import {
  type AudioMatter,
  getMarkdownContent,
  updatePostMatterValue,
  type PostMatter,
} from '#common/markdown/markdown.ts';
import { getPathInfo } from '#common/file-utils.ts';

const execPromise = promisify(exec);

const IA = {
  binary: 'ia',
  retries: 3,
};

const IA_AUDIO_KEY = 'ia';

const DEFAULT_METADATA = {
  mediatype: 'audio',
  licenseurl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  collection: 'opensource_audio',
} as const;

type UploadOptions = {
  config: string;
};

export function upload(file: string[], { config }: UploadOptions) {
  traverseFiles(
    file[0],
    async (filePath) => {
      uploadFromMarkdown(filePath, config);
    },
    '.md'
  );
}

async function uploadFromMarkdown(mdPath: string, config: string) {
  const markdown = getMarkdownContent<PostMatter>(mdPath);
  const { frontMatter, content } = markdown;
  const { title, authors, lang, date, slug, audio, tags, license } =
    frontMatter;

  const iaUrl = checkUploaded(audio);
  if (iaUrl) {
    console.error(`Audio already uploaded to Internet Archive.\n${iaUrl}`);
    return;
  }

  const audioPath = getAudioPath(mdPath, audio);

  const identifier = `bs-goswami-${slug}`;
  const creator = authors[0];
  const year = new Date(date).getFullYear();
  const subject = tags ? tags.join(',') : '';
  const licenseurl = license || DEFAULT_METADATA.licenseurl;

  const command = `${IA.binary} --config-file ${config} upload ${identifier} ${audioPath} \
    --metadata="title:${title}" \
    --metadata="language:${lang}" \
    --metadata="creator:${creator}" \
    --metadata="mediatype:${DEFAULT_METADATA.mediatype}" \
    --metadata="subject:${subject}" \
    --metadata="licenseurl:${licenseurl}" \
    --metadata="collection:${DEFAULT_METADATA.collection}" \
    --metadata="date:${date}" \
    --metadata="year:${year}" \
    --metadata="description:${content}" \
    --retries=${IA.retries} \
  && echo "Uploaded to https://archive.org/details/${identifier}" \
  && echo "Upload completed at $$(date)"`;

  // const args2 = [
  //   '--config-file',
  //   IA.configFile,
  //   'upload',
  //   identifier,
  //   audioPath,
  //   `--metadata="title:${title}"`,
  //   `--metadata="language:${lang}"`,
  //   `--metadata="creator:${creator}"`,
  //   `--metadata="mediatype:${DEFAULT_METADATA.mediatype}"`,
  //   `--metadata="subject:${subject}"`,
  //   `--metadata="licenseurl:${licenseurl}"`,
  //   `--metadata="collection:${DEFAULT_METADATA.collection}"`,
  //   `--metadata="date:${date}"`,
  //   `--metadata="year:${year}"`,
  //   `--metadata="description:${content}"`,
  //   '--retries',
  //   `${IA.retries}`,
  // ];

  try {
    await runCommandExec(command);
    console.log(`Uploaded to https://archive.org/details/${identifier}"`);

    const pathInfo = getPathInfo(audioPath);
    const audioLink = `https://archive.org/download/${identifier}/${pathInfo.baseName}`;

    updateAudioValue(mdPath, audio, audioLink);
  } catch (error) {
    logError(error);
  }
}

function updateAudioValue(mdPath: string, audio: AudioMatter, iaUrl: string) {
  let newAudioValue: AudioMatter = '';
  if (typeof audio === 'string') {
    newAudioValue = {
      [IA_AUDIO_KEY]: iaUrl,
      file: audio,
    };
  } else if (typeof audio === 'object') {
    newAudioValue = {
      [IA_AUDIO_KEY]: iaUrl,
      ...audio,
    };
  }

  updatePostMatterValue(mdPath, 'audio', newAudioValue);
}

async function runCommandExec(command: string) {
  const { stdout, stderr } = await execPromise(command);
  if (stdout) {
    console.log('Output:', stdout);
  }
  if (stderr) {
    console.error('Error:', stderr);
  }
}

function logError(error: unknown) {
  if (error instanceof Error) {
    console.error('Execution Failed:', error.message);
    if ('code' in error && typeof error.code === 'number') {
      console.error(`Exit Code: ${error.code}`);
    }
    if ('stderr' in error && typeof error.stderr === 'string') {
      console.error(`Error Output: ${error.stderr}`);
    }
    if ('stdout' in error && typeof error.stdout === 'string') {
      console.log(`Standard Output (if any): ${error.stdout}`);
    }
  } else if (typeof error === 'string') {
    console.error('Execution Failed with string error:', error);
  } else {
    console.error('Execution Failed with unknown error:', error);
  }
}

function getAudioPath(mdPath: string, audio: AudioMatter): string {
  if (typeof audio === 'object') {
    return nodePath.resolve(nodePath.dirname(mdPath), audio.file);
  }

  return nodePath.resolve(nodePath.dirname(mdPath), audio);
}

function checkUploaded(audio: AudioMatter): string | null {
  if (
    typeof audio === 'string' &&
    audio.includes('https://archive.org/download/')
  ) {
    return audio;
  }

  if (
    typeof audio === 'object' &&
    audio[IA_AUDIO_KEY] &&
    audio[IA_AUDIO_KEY].includes('https://archive.org/download/')
  ) {
    return audio[IA_AUDIO_KEY];
  }

  return null;
}

function runCommandSpawn(command: string, args: string[]) {
  // const cmd = spawn(command, args, {
  //   stdio: ['inherit', 'pipe', 'pipe'],
  //   detached: false,
  // });

  const result = spawnSync(command, args, {
    stdio: ['inherit', 'pipe', 'pipe'], // Pipe stdout/stderr for capturing output
    encoding: 'utf8', // Ensure output is returned as strings
  });

  // // Capture and display stdout (progress updates, success messages)
  // cmd.stdout.on('data', (data) => {
  //   process.stdout.write(data); // Write directly to console for real-time display
  // });

  // cmd.stderr.on('data', (data) => {
  //   process.stderr.write(data); // Write errors to stderr for real-time display
  // });

  // // Handle process completion
  // cmd.on('close', (code) => {
  //   console.log(`Process exited with code ${code}`);
  // });

  // // Handle process errors (e.g., binary not found, invalid args)
  // cmd.on('error', (error) => {
  //   console.error(`Failed to start process: ${error.message}`);
  // });

  // Display stdout (progress updates, success messages)
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  // Filter and display stderr (errors, warnings, excluding resource_tracker warning)
  if (result.stderr) {
    const stderrStr = result.stderr;
    if (
      !stderrStr.includes(
        'resource_tracker: There appear to be 1 leaked semaphore objects'
      )
    ) {
      process.stderr.write(stderrStr);
    }
  }

  // Check exit status
  if (result.error) {
    console.error(`Failed to start process: ${result.error.message}`);
  } else {
    console.log(`Upload process exited with code ${result.status}`);
  }
}
