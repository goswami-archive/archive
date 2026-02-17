import OpenAI from 'openai';

const { OPENROUTER_API_KEY } = process.env;

type GetClient = {
  (): OpenAI;
  client?: OpenAI;
};

export const getClient: GetClient = (): OpenAI => {
  if (getClient.client) {
    return getClient.client;
  }

  if (!OPENROUTER_API_KEY) {
    throw new Error(
      'OPENROUTER_API_KEY is not defined in environment variables'
    );
  }

  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: OPENROUTER_API_KEY,
    defaultHeaders: {},
  });

  getClient.client = client;

  return client;
};
