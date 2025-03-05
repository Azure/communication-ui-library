import { AzureOpenAI } from 'openai';
import { MessageContent, MessageCreateParams } from 'openai/resources/beta/threads/messages';

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

const formContextItems = (context: ContextItem[]): MessageCreateParams[] => {
  const messages: MessageCreateParams[] = [];
  context.forEach((item) => {
    const content = `${item.senderName}: ${item.content}`;
    messages.push({ role: item.senderName === 'assistant' ? 'assistant' : 'user', content });
  });
  return messages;
};

export const askAI = async (prompt: string, userDisplayName: string, context: ContextItem[] = []): Promise<string> => {
  try {
    const contextItems: MessageCreateParams[] = formContextItems(context);

    // Create an assistant and a thread
    const assistant = await azureOpenAIClient.beta.assistants.create({
      name: 'Assistant',
      instructions: 'You are a personal assistant to help me facilitate the chat.',
      tools: [{ type: 'code_interpreter' }],
      model: openAiDeployment
    });
    const thread = await azureOpenAIClient.beta.threads.create();

    // Cycle through the context items and add them to the thread
    for (const item of contextItems) {
      await azureOpenAIClient.beta.threads.messages.create(thread.id, item);
    }

    await azureOpenAIClient.beta.threads.messages.create(thread.id, {
      content: prompt,
      role: 'user'
    });
    const run = await azureOpenAIClient.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
      stream: false
    });
    let response = '';
    if (run.status === 'completed') {
      const messages = await azureOpenAIClient.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        const content = message.content[0] as MessageContent;
        if (content.type === 'text' && message.role === 'assistant') {
          console.log(`Message from ${message.role}: ${content.text.value}`);
          response = content.text.value;
        }
      }
    } else {
      console.log(run.status);
    }

    return response;
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw error;
  }
};
