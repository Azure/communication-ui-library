import { ChatMessageType } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  CompositeLocale,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter,
  MessageProps,
  MessageRenderer,
  ChatMessageWithStatus
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import { ChatMessage as FluentChatMessage } from '@fluentui-contrib/react-chat';
import React, { useMemo, useEffect, useState } from 'react';
import { askAI, ContextItem } from './AIClient';

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
    {
      endpoint: props.endpointUrl,
      userId,
      displayName,
      credential,
      threadId: props.threadId
    },
    parseMessageBeforeSend
  );

  async function parseMessageBeforeSend(adapter: ChatAdapter): Promise<ChatAdapter> {
    const sendMessage = adapter.sendMessage.bind(adapter);
    adapter.sendMessage = async (content: string): Promise<void> => {
      console.log('Previous messages:', adapter.getState().thread.chatMessages);
      // Look for the token `/bot` in the message content.
      if (content.startsWith('/bot')) {
        // If the token is found, remove it from the message content.
        const msgToBot = content.slice(4).trim();
        // get the history of the thread
        const messages = adapter.getState().thread?.chatMessages;
        const displayName = adapter.getState().displayName;
        const history: ContextItem[] = [];
        for (const [_, message] of Object.entries(messages)) {
          console.log(`Message from ${message.senderDisplayName}: ${message.content}`);
          history.push({
            senderName: message.senderDisplayName ?? '',
            content: message.content?.message ?? ''
          });
        }

        const response = await askAI(msgToBot, displayName, history);
        await sendMessage(response, {
          senderDisplayName: 'Bot',
          type: 'text'
        });
        // const botMessage = {
        //   id: Math.random().toString(),
        //   type: 'text' as ChatMessageType,
        //   sequenceId: Math.random().toString(),
        //   version: 'openAiDeployment',
        //   messageType: 'custom',
        //   createdOn: new Date(),
        //   messageId: Math.random().toString(),
        //   content: { message: response }
        // };

        // adapter.getState().thread.chatMessages['bot'] = {
        //   ...botMessage,
        //   status: 'delivered'
        // };

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
          onRenderMessage={onRenderMessage}
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

export const onRenderMessage = (messageProps: MessageProps, defaultOnRender?: MessageRenderer): JSX.Element => {
  if (messageProps.message.messageType === 'custom') {
    // Custom rendering for bot messages
    return <FluentChatMessage author={'===Bot==='}>{messageProps.message.content}</FluentChatMessage>;
  }
  if (messageProps.message.messageType === 'chat' && messageProps.message.senderDisplayName === 'Bot') {
    // Custom rendering for bot messages
    return (
      <FluentChatMessage author={messageProps.message.senderDisplayName}>
        {messageProps.message.content}
      </FluentChatMessage>
    );
  }

  return defaultOnRender ? defaultOnRender(messageProps) : <></>;
};
