import { traverseFiles } from '#common/traverseFiles.ts';
import {
  type AudioMatter,
  getMarkdownContent,
  type PostMatter,
} from '#common/markdown/markdown.ts';
import {
  DEFAULT_METADATA,
  IA,
  IA_AUDIO_KEY,
} from '#internet-archive/globals.ts';
import { logError, runCommandExec } from '#internet-archive/process/run.ts';

type UpdateOptions = {
  config: string;
};

export function update(file: string[], { config }: UpdateOptions) {
  traverseFiles(
    file[0],
    async (filePath) => {
      updateFromMarkdown(filePath, config);
    },
    '.md'
  );
}

async function updateFromMarkdown(mdPath: string, config: string) {
  const markdown = getMarkdownContent<PostMatter>(mdPath);
  const { frontMatter, content } = markdown;
  const { title, authors, lang, date, audio, tags, license, location } =
    frontMatter;

  const identifier = getIdentifierFromUrl(audio);

  const creator = authors[0];
  const licenseurl = license || DEFAULT_METADATA.licenseurl;

  const command = `${IA.binary} --config-file ${config} metadata ${identifier} \
    --modify="title:${title}" \
    --modify="language:${lang}" \
    --modify="creator:${creator}" \
    ${tags ? `--modify="subject:${tags.join(',')}"` : ''} \
    ${licenseurl ? `--modify="licenseurl:${licenseurl}"` : ''} \
    ${
      date
        ? `--modify="date:${date}" --modify="year:${new Date(
            date
          ).getFullYear()}"`
        : ''
    } \
    ${location ? `--modify="location:${location}"` : ''} \
    ${content ? `--modify="description:${content}"` : ''}`;

  try {
    await runCommandExec(command);
    console.log(`Updated item https://archive.org/details/${identifier}"`);
  } catch (error) {
    logError(error);
  }
}

function getIdentifierFromUrl(audio: AudioMatter): string {
  const url = typeof audio === 'object' ? audio[IA_AUDIO_KEY] : audio;
  const match = url.match(/\/download\/([^/]+)/);
  if (!match) {
    throw new Error('IA item identifier not found in audio field');
  }

  return match[1];
}
