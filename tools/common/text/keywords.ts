import { aiQuery } from '#common/ai/aiQuery.ts';

export async function keywords(
  content: string,
  count: number = 5
): Promise<string[]> {
  const prompt = `Extract up to ${count} concise, relevant keywords from the following text for use as website tags. Avoid duplicates, use lowercase, and prefer single words when possible. Return the keywords as a comma-separated list.\n\nText:"""${content}"""`;
  const response = await aiQuery(prompt, content);
  const keywords = response.split(',').map((keyword) => keyword.trim());

  return keywords;
}
