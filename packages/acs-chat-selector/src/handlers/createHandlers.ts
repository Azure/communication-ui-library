// © Microsoft Corporation. All rights reserved.
import { ReactElement } from 'react';
import { DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { ChatThreadClient } from '@azure/communication-chat';
import memoizeOne from 'memoize-one';

export type DefaultHandlers = {
  onMessageSend: (content: string) => Promise<void>;
  onMessageSeen: (chatMessageId: string) => Promise<void>;
  onTyping: () => Promise<void>;
};

// Keep all these handlers the same instance(unless client changed) to avoid re-render
const createDefaultHandlers = memoizeOne((chatClient: DeclarativeChatClient, chatThreadClient: ChatThreadClient) => {
  return {
    onMessageSend: async (content: string) => {
      await chatThreadClient.sendMessage({ content });
    },
    // This handler is designed for chatThread to consume
    onMessageSeen: async (chatMessageId: string) => {
      await chatThreadClient.sendReadReceipt({ chatMessageId });
    },
    onTyping: async () => {
      await chatThreadClient.sendTypingNotification();
    }
  };
});

export type CommonProperties<A, B> = {
  [P in keyof A & keyof B]: A[P] extends B[P] ? (A[P] extends B[P] ? P : never) : never;
}[keyof A & keyof B];

type Common<A, B> = Pick<A, CommonProperties<A, B>>;

// These could be shared functions between Chat and Calling
export const defaultHandlerCreator = (chatClient: DeclarativeChatClient, chatThreadClient: ChatThreadClient) => <Props>(
  _: (props: Props) => ReactElement | null
): Common<DefaultHandlers, Props> => {
  return createDefaultHandlers(chatClient, chatThreadClient);
};

export const createDefaultHandlersForComponent = <Props>(
  chatClient: DeclarativeChatClient,
  chatThreadClient: ChatThreadClient,
  _: (props: Props) => ReactElement | null
): Common<DefaultHandlers, Props> => {
  return createDefaultHandlers(chatClient, chatThreadClient);
};
