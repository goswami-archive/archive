import postSchema from "./schema/post.js";
import categorySchema from "./schema/category.js";

export function validate(object) {
  const schema = getSchema(object.type);
  if (!schema) {
    return [`'type' must be one of the following: post, category, playlist.`];
  }

  const { error } = schema.validate(object, {
    abortEarly: false
  });

  return error ? error.details.map((e) => e.message) : [];
}

function getSchema(type) {
  switch (type) {
    case "post": return postSchema;
    case "category":
    case "playlist": return categorySchema;
    default: return null;
  }
}
