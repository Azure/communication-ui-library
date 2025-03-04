import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  CompositeLocale,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import { AzureOpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import React, { useMemo, useEffect, useState } from 'react';

export type ContainerProps = {
  /** UserIdentifier is of type CommunicationUserIdentifier see below how to construct it from a string input */
  userIdentifier: string;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  errorBar?: boolean;
  participants?: boolean;
  topic?: boolean;
  locale?: CompositeLocale;
  formFactor?: 'desktop' | 'mobile';
  richTextEditor?: boolean;
};

export const ContosoChatContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  const userId = useMemo(
    () => fromFlatCommunicationIdentifier(props.userIdentifier) as CommunicationUserIdentifier,
    [props.userIdentifier]
  );

  // Add throttling for setting display name during typing
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  useEffect(() => {
    const handle = setTimeout(() => {
      setDisplayName(props.displayName);
    }, 500);
    return () => clearTimeout(handle);
  }, [props.displayName]);

  const adapter = useAzureCommunicationChatAdapter(
    { endpoint: props.endpointUrl, userId, displayName, credential, threadId: props.threadId },
    parseMessageBeforeSend
  );

  async function parseMessageBeforeSend(adapter: ChatAdapter): Promise<ChatAdapter> {
    const sendMessage = adapter.sendMessage.bind(adapter);
    adapter.sendMessage = async (content: string): Promise<void> => {
      // Look for the token `/bot` in the message content.
      console.log('Content is ', content);
      if (content.startsWith('/bot')) {
        // If the token is found, remove it from the message content.
        const msgToBot = content.slice(4).trim();
        // Send the message to the OpenAI API.
        const response = await sendMessageToOpenAI(msgToBot);
        console.log('Response from OpenAI:', response);
        return;
      }

      await sendMessage(content);
    };
    return adapter;
  }

  if (adapter) {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        <ChatComposite
          adapter={adapter}
          fluentTheme={props.fluentTheme}
          rtl={props.rtl ?? false}
          options={{
            errorBar: props.errorBar,
            participantPane: props.participants,
            topic: props.topic,
            richTextEditor: props.richTextEditor
          }}
          locale={props.locale}
        />
      </div>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};

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

export const sendMessageToOpenAI = async (message: string): Promise<string> => {
  try {
    const messages: ChatCompletionMessageParam[] = [];
    messages.push({ role: 'system', content: 'You are a personal assistant to me in this chat' });
    messages.push({ role: 'user', content: message });
    const stream = await azureOpenAIClient.chat.completions.create({
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
