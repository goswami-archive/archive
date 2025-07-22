import nodePath from 'node:path';
import { traverseFiles } from '#common/traverseFiles.ts';
import {
  type AudioMatter,
  getMarkdownContent,
  updatePostMatterValue,
  type PostMatter,
} from '#common/markdown/markdown.ts';
import { getPathInfo } from '#common/file-utils.ts';
import {
  DEFAULT_METADATA,
  getIdentifier,
  IA,
  IA_AUDIO_KEY,
} from '#internet-archive/globals.ts';
import { logError, runCommandExec } from '#internet-archive/process/run.ts';

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
  const { title, authors, lang, date, slug, audio, tags, license, location } =
    frontMatter;

  const iaUrl = checkUploaded(audio);
  if (iaUrl) {
    console.error(`Audio already uploaded to Internet Archive.\n${iaUrl}`);
    return;
  }

  const audioFile = getAudioPath(mdPath, audio);

  const identifier = getIdentifier(slug);
  const creator = authors[0];
  const licenseurl = license || DEFAULT_METADATA.licenseurl;

  const command = `${
    IA.binary
  } --config-file ${config} upload ${identifier} ${audioFile} \
    --retries=${IA.retries} \
    --metadata="title:${title}" \
    --metadata="language:${lang}" \
    --metadata="creator:${creator}" \
    --metadata="mediatype:${DEFAULT_METADATA.mediatype}" \
    --metadata="collection:${DEFAULT_METADATA.collection}" \
    ${tags ? `--metadata="subject:${tags.join(',')}"` : ''} \
    ${licenseurl ? `--metadata="licenseurl:${licenseurl}"` : ''} \
    ${
      date
        ? `--metadata="date:${date}" --metadata="year:${new Date(
            date
          ).getFullYear()}"`
        : ''
    } \
    ${location ? `--metadata="location:${location}"` : ''} \
    ${content ? `--metadata="description:${content}"` : ''} \
    `;

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

    const pathInfo = getPathInfo(audioFile);
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
