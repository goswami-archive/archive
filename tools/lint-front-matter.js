const matter = require("gray-matter");
const revalidator = require("revalidator");
const categorySchema = require("./schema/front-matter/category");
const postSchema = require("./schema/front-matter/post");

function lintFrontMatter(file) {
  const messages = [];
  const yamlObj = matter.read(file, { language: "yaml" }).data;
  const schema = yamlObj.type === "post" ? postSchema : categorySchema;

  const { valid, errors } = revalidator.validate(yamlObj, schema, {
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
