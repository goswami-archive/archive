import fs from "node:fs";
import nodePath from "node:path";
import { getMarkdownContent, writePost } from "#common/markdown/markdown.js";
import { formatDuration } from "#common/format-duration.js";
import { traverseFiles } from "#common/traverse-files.js";
import { getMp3Metadata, isLocalFile } from '#common/file-utils.js';

export function updateDuration(path) {
  const resolvedPath = nodePath.resolve(process.cwd(), path);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Path ${resolvedPath} does not exist.`);
    process.exit(1);
  }

  if (fs.statSync(resolvedPath).isDirectory()) {
    traverseFiles(
      resolvedPath,
      (filePath) => {
        updateMarkdownDuration(filePath);
      },
      ".md"
    );
  } else {
    if (resolvedPath.endsWith(".md")) {
      updateMarkdownDuration(resolvedPath);
    } else {
      console.error(`File ${resolvedPath} is not a markdown file.`);
    }
  }
}

/**
 * Update duration field in markdown file from referenced audio file
 * @param {string} mdPath
 */
async function updateMarkdownDuration(mdPath) {
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
