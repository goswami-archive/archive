import { type LanguageConfig } from './types.ts';

export const configs: Record<string, LanguageConfig> = {
  en: {
    openingQuote: '"',
    closingQuote: '"',
    openingSingleQuote: "'",
    closingSingleQuote: "'",
  },
  ru: {
    openingQuote: '«',
    closingQuote: '»',
    openingSingleQuote: "'",
    closingSingleQuote: "'",
  },
};

// const frenchConfig: LanguageConfig = {
//   openingQuote: '« ',
//   closingQuote: ' »',
//   openingSingleQuote: "'",
//   closingSingleQuote: "'",
// };

// const germanConfig: LanguageConfig = {
//   openingQuote: '„',
//   closingQuote: '"',
//   openingSingleQuote: "'",
//   closingSingleQuote: "'",
// };
