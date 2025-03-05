import { AzureOpenAI } from 'openai';
import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources';

const apiVersion = '';
const openAiEndpoint = '';
const openAiKey = '';
const openAiDeployment = '';

export const azureOpenAIClient = new AzureOpenAI({
  endpoint: openAiEndpoint,
  apiKey: openAiKey,
  apiVersion: apiVersion,
  deployment: openAiDeployment,
  dangerouslyAllowBrowser: true
});

export interface ContextItem {
  senderName: string;
  content: string;
}

const formContextItems = (context: ContextItem[]): ChatCompletionMessageParam[] => {
  const messages: ChatCompletionMessageParam[] = [];
  context.forEach((item) => {
    const content = `${item.senderName}: ${item.content}`;
    messages.push({ role: 'user', content });
  });
  return messages;
};

export const askAI = async (prompt: string, userDisplayName: string, context: ContextItem[] = []): Promise<string> => {
  try {
    const messages: ChatCompletionMessageParam[] = [];
    const contextItems: ChatCompletionMessageParam[] = formContextItems(context);
    messages.push({
      role: 'system',
      content:
        'You are a personal assistant to me in this chat.' +
        (userDisplayName ? ` The current user is ${userDisplayName}.` : '')
    });
    messages.push(...contextItems);
    messages.push({ role: 'assistant', content: prompt });
    const stream: ChatCompletion = await azureOpenAIClient.chat.completions.create({
      model: openAiDeployment,
      messages: messages,
      stream: false
    });

    return stream.choices[0]?.message?.content ?? 'undefined';
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw error;
  }
};
