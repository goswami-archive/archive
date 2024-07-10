import grayMatter from "gray-matter";
import revalidator from "revalidator";
import categorySchema from "./schema/front-matter/category.js";
import postSchema from "./schema/front-matter/post.js";

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

export { lintFrontMatter };
