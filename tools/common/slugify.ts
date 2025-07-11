import kebabCase from 'lodash.kebabcase';

export function slugify(text: string): string {
  let kebabed = kebabCase(text);
  // do not treat part number digit as separate word
  kebabed = kebabed.replace(/-p-(\d+)-/, '-p$1-');
  return kebabed;
}
