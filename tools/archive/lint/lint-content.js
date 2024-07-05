const cheerio = require("cheerio");
const fs = require("fs");
const allowedTags = require("./schema/allowed-tags.js");

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

module.exports = { lintContent };
