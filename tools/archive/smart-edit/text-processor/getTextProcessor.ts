import { configs } from './configs.ts';
import { TextProcessor } from './TextProcessor.ts';

export function getTextProcessor(language: string = 'en'): TextProcessor {
  const config = configs[language.toLowerCase()];
  if (!config) {
    throw new Error(
      `Language "${language}" is not supported. Available languages: ${Object.keys(
        configs
      ).join(', ')}`
    );
  }

  return new TextProcessor(config);
}
