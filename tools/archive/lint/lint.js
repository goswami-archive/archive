import fs from "node:fs";
import nodePath from "node:path";
import { globSync } from "glob";
import { lintContent } from "./lint-content.js";
import { lintFrontMatter } from "./lint-front-matter.js";
import { getRelativePath } from "#common/file-utils.js";

function lint({ files, path }) {
  const filePaths = getFiles(files, path);

  let hasErrors = false;

  filePaths.forEach((file) => {
    const messages = [];
    messages.push(...lintFrontMatter(file));
    messages.push(...lintContent(file));

    if (messages.length > 0) {
      hasErrors = true;
      printMessages(getRelativePath(file), messages);
    }
  });

  if (hasErrors) {
    process.exit(1);
  }
}

/**
 * @param {string[]} files
 * @param {string} path
 * @returns
 */
function getFiles(files, path) {
  const validFiles = [];

  if (path) {
    return globSync(nodePath.resolve(process.cwd(), path) + "/**/*.md", {
      absolute: true,
    });
  }

  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.error(`File ${file} does not exist.`);
      continue;
    }
    if (fs.lstatSync(file).isDirectory()) {
      console.error(`File ${file} is a directory.`);
      continue;
    }
    if (!file.endsWith(".md")) {
      console.error(`File ${file} is not a markdown file.`);
      continue;
    }

    validFiles.push(file);
  }

  return validFiles;
}

function printMessages(file, messages) {
  messages.forEach((message) => {
    console.error(`${file} \t ${message}`);
  });
}

export { lint };
