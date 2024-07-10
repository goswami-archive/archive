import kebabCase from "lodash.kebabcase";

/**
 * @param {string} text
 * @returns
 */
export function slugify(text) {
  let kebabed = kebabCase(text);
  // do not treat part number digit as separate word
  kebabed = kebabed.replace(/-p-(\d+)-/, "-p$1-");
  return kebabed;
}
