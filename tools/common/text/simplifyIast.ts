import { aiQuery } from '#common/ai/aiQuery.ts';

export async function simplifyIast(text: string): Promise<string> {
  const prompt = `Replace IAST diacritics with simplified version in following content (output just processed content):`;

  return aiQuery(prompt, text);
}
