// import kebabCase from 'lodash.kebabcase';
import { default as sindresorhusSlugify } from '@sindresorhus/slugify';

export function slugify(text: string): string {
  // let kebabed = kebabCase(text);
  // // do not treat part number digit as separate word
  // kebabed = kebabed.replace(/-p-(\d+)-/, '-p$1-');
  // return kebabed;

  return sindresorhusSlugify(text);
}
