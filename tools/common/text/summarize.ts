import { aiQuery } from '#common/ai/aiQuery.ts';

export async function summarize(content: string): Promise<string> {
  const setup =
    'You are an assistant that writes SEO-optimized meta descriptions.';
  const prompt = `Write a concise SEO meta description (max 160 characters) for
    the following content. Print just the description without explanation or words count. Content:`;

  return aiQuery(prompt, content, setup);
}

export async function keywords(content: string): Promise<string[]> {
  const prompt = `Extract up to 5 concise, relevant keywords from the following text for use as website tags. Avoid duplicates, use lowercase, and prefer single words when possible. Return the keywords as a comma-separated list.\n\nText:"""${content}"""`;
  const response = await aiQuery(prompt, content);
  const keywords = response.split(',').map((keyword) => keyword.trim());

  return keywords;
}
