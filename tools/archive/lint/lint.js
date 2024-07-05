const { globSync } = require("glob");
const fs = require("fs");
const pathModule = require("path");
const { lintContent } = require("./lint-content.js");
const { lintFrontMatter } = require("./lint-front-matter.js");
const { getRelativePath } = require("../../common/file-utis.js");

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
  const validFiles = []

  if (path) {
    return globSync(pathModule.resolve(process.cwd(), path) + "/**/*.md", {
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

module.exports = { lint };
