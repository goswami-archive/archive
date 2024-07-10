import fs from "node:fs";
import cheerio from "cheerio";
import allowedTags from "./schema/allowed-tags.js";

function lintContent(file) {
  const messages = [];
  const $ = cheerio.load(fs.readFileSync(file), null, false);

  $("*").each((index, element) => {
    const tagName = element.tagName;

    if (!allowedTags.includes(tagName)) {
      messages.push(`Tag <${tagName}> not allowed in content.`);
    }
  });

  return messages;
}

export { lintContent };
