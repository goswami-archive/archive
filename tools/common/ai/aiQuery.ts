import '@dotenvx/dotenvx/config';
import { type ChatCompletionMessageParam } from 'openai/resources/index';
import { getClient } from './getClient.ts';

export async function aiQuery(
  prompt: string,
  input: string,
  setupMessage?: string
): Promise<string> {
  const { AI_MODEL } = process.env;

  if (!AI_MODEL) {
    throw new Error('AI_MODEL is not defined in environment variables');
  }

  const userMessage = {
    role: 'user' as const,
    content: `${prompt}\n\n${input}`,
  };

  const messages: ChatCompletionMessageParam[] = [userMessage];
  if (setupMessage) {
    messages.push({ role: 'system' as const, content: setupMessage });
  }

  const completion = await getClient().chat.completions.create({
    model: AI_MODEL as string,
    messages,
    temperature: 0.5,
  });

  const answer = completion.choices[0].message.content?.trim();

  return answer || '';
}
