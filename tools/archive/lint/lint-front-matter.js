const grayMatter = require("gray-matter");
const revalidator = require("revalidator");
const categorySchema = require("./schema/front-matter/category");
const postSchema = require("./schema/front-matter/post");

function lintFrontMatter(file) {
  const messages = [];
  const matter = grayMatter.read(file, { language: "yaml" }).data;
  const schema = matter.type === "post" ? postSchema : categorySchema;

  const { valid, errors } = revalidator.validate(matter, schema, {
    additionalProperties: false,
  });

  if (!valid) {
    errors.forEach(({ property, message }) => {
      messages.push(`Property '${property}' ${message}`);
    });
  }

  return messages;
}

module.exports = { lintFrontMatter };
