import fs from 'node:fs';
import nodePath from 'node:path';
import {
  type AudioMatter,
  type PostMatter,
  getMarkdownContent,
  writePost,
} from '#common/markdown/markdown.ts';
import { formatDuration } from '#common/formatDuration.ts';
import { traverseFiles } from '#common/traverseFiles.ts';
import { getMp3Metadata, isLocalFile } from '#common/file-utils.ts';

export function updateDuration(path: string) {
  traverseFiles(
    path,
    async (filePath) => {
      updateMarkdownDuration(filePath);
    },
    '.md'
  );
}

/**
 * Update duration field in markdown file from referenced audio file
 */
async function updateMarkdownDuration(mdPath: string): Promise<void> {
  const markdown = getMarkdownContent<PostMatter>(mdPath);
  const { frontMatter } = markdown;
  const { type, duration, audio } = frontMatter;

  if (type !== 'post') {
    return;
  }

  const localFile = getLocalFile(audio);
  if (!localFile) {
    return;
  }

  const audioPath = nodePath.resolve(nodePath.dirname(mdPath), localFile);

  if (!fs.existsSync(audioPath)) {
    return;
  }

  const metaData = await getMp3Metadata(audioPath);
  const currentDuration = formatDuration(metaData.duration);

  if (!duration || duration !== currentDuration) {
    frontMatter.duration = currentDuration;
    writePost(mdPath, markdown);
  }
}

function getLocalFile(audio: AudioMatter): string | null {
  if (typeof audio === 'string' && isLocalFile(audio)) {
    return audio;
  }

  if (typeof audio === 'object' && audio.file) {
    return audio.file;
  }

  return null;
}
