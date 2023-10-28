const matter = require("gray-matter");
const revalidator = require("revalidator");
const frontMatterSchema = require("./schema/front-matter");

function lintFrontMatter(file) {
  const messages = [];

  const yamlObj = matter.read(file, { language: "yaml" }).data;
  const { valid, errors } = revalidator.validate(yamlObj, frontMatterSchema, {
    additionalProperties: false,
  });

  if (!valid) {
    errors.forEach(({ property, message }) => {
      messages.push(`Property '${property}' ${message}`);
    });
  }

  return messages.length === 0 ? null : messages;
}

module.exports = { lintFrontMatter };
