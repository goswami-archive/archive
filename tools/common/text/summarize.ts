import '@dotenvx/dotenvx/config';
import { OpenAI } from 'openai';

const AI_MODEL = 'deepseek/deepseek-chat:free';

const aiClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    // 'HTTP-Referer': '', // Optional. Site URL for rankings on openrouter.ai.
    // 'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
  },
});

export async function summarize(content: string): Promise<string> {
  const prompt = `Write a concise SEO meta description (max 160 characters) for this content:\n\n${content}`;
  const completion = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an assistant that writes SEO-optimized meta descriptions.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.5,
  });

  const summary = completion.choices[0].message.content?.trim();

  return summary || '';
}

export async function keywords(content: string): Promise<string[]> {
  const prompt = `Extract up to 5 concise, relevant keywords from the following text for use as website tags. Avoid duplicates, use lowercase, and prefer single words when possible. Return the keywords as a comma-separated list.\n\nText:"""${content}"""`;

  const completion = await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
  });

  const response = completion.choices[0].message.content?.trim() || '';
  const keywords = response.split(',').map((keyword) => keyword.trim());

  return keywords;
}
