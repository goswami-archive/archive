import '@dotenvx/dotenvx/config';
import { OpenAI } from 'openai';
import { type ChatCompletionMessageParam } from 'openai/resources/index';

const { OPENROUTER_API_KEY, AI_MODEL } = process.env;

const aiClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {},
});

export async function aiQuery(
  prompt: string,
  input: string,
  setupMessage?: string
): Promise<string> {
  const userMessage = {
    role: 'user' as const,
    content: `${prompt}\n\n${input}`,
  };

  const messages: ChatCompletionMessageParam[] = [userMessage];
  if (setupMessage) {
    messages.push({ role: 'system' as const, content: setupMessage });
  }

  const completion = await aiClient.chat.completions.create({
    model: AI_MODEL as string,
    messages,
    temperature: 0.5,
  });

  const answer = completion.choices[0].message.content?.trim();

  return answer || '';
}
