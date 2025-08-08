import { aiQuery } from '#common/ai/aiQuery.ts';

export async function summarize(
  content: string,
  maxLength: number = 160
): Promise<string> {
  const setup =
    'You are an assistant that writes SEO-optimized meta descriptions.';
  const prompt = `Write a concise SEO meta description of maximum ${maxLength} characters for
    the following content. Dont use diacritics, use simplified versions for sanskrit words. Print just the description without explanation or words count. Content:`;

  return aiQuery(prompt, content, setup);
}
