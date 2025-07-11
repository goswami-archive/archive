import fs from 'node:fs';
import nodePath from 'node:path';
import { getMarkdownContent, writePost } from '#common/markdown/markdown.ts';
import { formatDuration } from '#common/formatDuration.ts';
import { traverseFiles } from '#common/traverseFiles.ts';
import { getMp3Metadata, isLocalFile } from '#common/file-utils.ts';

export function updateDuration(path: string) {
  const resolvedPath = nodePath.resolve(process.cwd(), path);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Path ${resolvedPath} does not exist.`);
    process.exit(1);
  }

  if (fs.statSync(resolvedPath).isDirectory()) {
    traverseFiles(
      resolvedPath,
      async (filePath) => {
        updateMarkdownDuration(filePath);
      },
      '.md'
    );
  } else {
    if (resolvedPath.endsWith('.md')) {
      updateMarkdownDuration(resolvedPath);
    } else {
      console.error(`File ${resolvedPath} is not a markdown file.`);
    }
  }
}

/**
 * Update duration field in markdown file from referenced audio file
 */
async function updateMarkdownDuration(mdPath: string): Promise<void> {
  const markdown = getMarkdownContent(mdPath);
  const { frontMatter } = markdown;
  const { duration, audio } = frontMatter;

  if (!audio || !isLocalFile(audio)) {
    return;
  }

  const audioPath = nodePath.resolve(nodePath.dirname(mdPath), audio);

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
