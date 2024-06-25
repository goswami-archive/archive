// find . -type f -name "*.md" -mmin -10 -exec rm -f {} \;
const fs = require("fs");
const pathModule = require("path");
const { slugify } = require("../common/slagify");
const { FILE_NAME_REGEX } = require("../common/regex");
const { getMediaTags, parseFileName } = require("../common/file-utis");

const dirPath = process.argv[2];

const resolvedPath = pathModule.resolve(process.cwd(), dirPath);

genmdRecursive(resolvedPath);

function genmdRecursive(dir, mp3Files = []) {
  const files = fs.readdirSync(dir);

  files.forEach(async (file) => {
    const filePath = pathModule.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      genmdRecursive(filePath, mp3Files);
    } else if (stat.isFile() && pathModule.extname(file) === ".mp3") {
      if (file.match(FILE_NAME_REGEX)) {
        await createMarkdown(filePath);
      }
    }
  });

  return mp3Files;
}

async function createMarkdown(mp3Path) {
  const mdPath = mp3Path.replace(/\.mp3$/, ".md");
  if (fs.existsSync(mdPath)) {
    return;
  }
  const content = await getMarkdown(mp3Path);
  fs.writeFile(mdPath, content, (err) => {});
}

async function getMarkdown(mp3Path) {
  const fileName = pathModule.basename(mp3Path, ".mp3");
  const { lang, date } = parseFileName(fileName);
  const { title, lyrics } = await getMediaTags(mp3Path);
  const slug = slugify(fileName);

  const postTemplate = `---
type: post
lang: ${lang}
title: ${title}
authors:
  - ${lang === "en" ? "Bhakti Sudhir Goswami" : "Бхакти Судхир Госвами"}
date: ${date}
audio: ${fileName + ".mp3"}
draft: true
slug: ${slug}
---

${lyrics}
`;

  return postTemplate;
}
