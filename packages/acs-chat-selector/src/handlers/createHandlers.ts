import { ReactElement } from 'react';
import { DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { ChatThreadClient } from '@azure/communication-chat';
import memoizeOne from 'memoize-one';

type DefaultHandlers = {
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
    onMessageSeen: async (chatMessageId: string) => {
      await chatThreadClient.sendReadReceipt({ chatMessageId });
    },
    onTyping: async () => {
      await chatThreadClient.sendTypingNotification();
    }
  };
});

type CommonProperties<A, B> = {
  [P in keyof A & keyof B]: A[P] extends B[P] ? (A[P] extends B[P] ? P : never) : never;
}[keyof A & keyof B];

type Common<A, B> = Pick<A, CommonProperties<A, B>>;

// These could be shared functions between Chat and Calling
export const defaultHandlerCreator = (chatClient: DeclarativeChatClient, chatThreadClient: ChatThreadClient) => <Props>(
  _component: (props: Props) => ReactElement | null
): Common<DefaultHandlers, Props> => {
  return createDefaultHandlers(chatClient, chatThreadClient);
};

export const createDefaultHandlersForComponent = <Props>(
  chatClient: DeclarativeChatClient,
  chatThreadClient: ChatThreadClient,
  _component: (props: Props) => ReactElement | null
): Common<DefaultHandlers, Props> => {
  return createDefaultHandlers(chatClient, chatThreadClient);
};
