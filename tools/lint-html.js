const cheerio = require("cheerio");
const fs = require("fs");
const allowedTags = require("./schema/allowed-tags.js");

function lintHtml(file) {
  const messages = [];
  const $ = cheerio.load(fs.readFileSync(file), null, false);

  $("*").each((index, element) => {
    const tagName = element.tagName;

    if (!allowedTags.includes(tagName)) {
      messages.push(`Tag <${tagName}> not allowed in markdown.`);
    }
  });

  return messages.length === 0 ? null : messages;
}

module.exports = { lintHtml };
