// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ReactElement } from 'react';
import { DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { ChatThreadClient } from '@azure/communication-chat';
import memoizeOne from 'memoize-one';

export type DefaultHandlers = {
  onMessageSend: (content: string) => Promise<void>;
  onMessageSeen: (chatMessageId: string) => Promise<void>;
  onTyping: () => Promise<void>;
  removeThreadMember: (userId: string) => Promise<void>;
  updateThreadTopicName: (topicName: string) => Promise<void>;
  onLoadPreviousChatMessages: (messagesToLoad: number) => Promise<boolean>;
};

// Keep all these handlers the same instance(unless client changed) to avoid re-render
const createDefaultHandlers = memoizeOne(
  (chatClient: DeclarativeChatClient, chatThreadClient: ChatThreadClient): DefaultHandlers => {
    const messageIterator = chatThreadClient.listMessages();
    return {
      onMessageSend: async (content: string) => {
        const sendMessageRequest = {
          content,
          senderDisplayName: chatClient.state.displayName
        };
        await chatThreadClient.sendMessage(sendMessageRequest);
      },
      // This handler is designed for chatThread to consume
      onMessageSeen: async (chatMessageId: string) => {
        await chatThreadClient.sendReadReceipt({ chatMessageId });
      },
      onTyping: async () => {
        await chatThreadClient.sendTypingNotification();
      },
      removeThreadMember: async (userId: string) => {
        await chatThreadClient.removeParticipant({
          communicationUserId: userId
        });
      },
      updateThreadTopicName: async (topicName: string) => {
        await chatThreadClient.updateThread({ topic: topicName });
      },
      onLoadPreviousChatMessages: async (messagesToLoad: number) => {
        let remainingMessagesToGet = messagesToLoad;
        let isAllChatMessagesLoaded = false;
        while (remainingMessagesToGet >= 1) {
          const message = await messageIterator.next();
          if (message.value?.type && message.value.type === 'text') remainingMessagesToGet--;
          // We have traversed all messages in this thread
          if (message.done) {
            isAllChatMessagesLoaded = true;
            break;
          }
        }

        return isAllChatMessagesLoaded;
      }
    };
  }
);

export type ChatCommonProperties<A, B> = {
  [P in keyof A & keyof B]: A[P] extends B[P] ? (A[P] extends B[P] ? P : never) : never;
}[keyof A & keyof B];

type Common<A, B> = Pick<A, ChatCommonProperties<A, B>>;

// These could be shared functions between Chat and Calling
export const defaultHandlerCreator = (chatClient: DeclarativeChatClient, chatThreadClient: ChatThreadClient) => <Props>(
  _: (props: Props) => ReactElement | null
): Common<DefaultHandlers, Props> => {
  return createDefaultHandlers(chatClient, chatThreadClient);
};

export const createDefaultChatHandlersForComponent = <Props>(
  chatClient: DeclarativeChatClient,
  chatThreadClient: ChatThreadClient,
  _: (props: Props) => ReactElement | null
): Common<DefaultHandlers, Props> => {
  return createDefaultHandlers(chatClient, chatThreadClient);
};
