// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ReactElement } from 'react';
import { Common, fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatError, StatefulChatClient } from '@internal/chat-stateful-client';
import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import memoizeOne from 'memoize-one';

export type ChatHandlers = {
  onSendMessage: (content: string) => Promise<void>;
  onMessageSeen: (chatMessageId: string) => Promise<void>;
  onTyping: () => Promise<void>;
  onParticipantRemove: (userId: string) => Promise<void>;
  updateThreadTopicName: (topicName: string) => Promise<void>;
  onLoadPreviousChatMessages: (messagesToLoad: number) => Promise<boolean>;
  onUpdateMessage: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
};

// Keep all these handlers the same instance(unless client changed) to avoid re-render
export const createDefaultChatHandlers = memoizeOne(
  (chatClient: StatefulChatClient, chatThreadClient: ChatThreadClient): ChatHandlers => {
    let messageIterator: PagedAsyncIterableIterator<ChatMessage> | undefined = undefined;
    return {
      onSendMessage: ignoreChatErrorAsync(async (content: string) => {
        const sendMessageRequest = {
          content,
          senderDisplayName: chatClient.getState().displayName
        };
        await chatThreadClient.sendMessage(sendMessageRequest);
      }),
      onUpdateMessage: ignoreChatErrorAsync(async (messageId: string, content: string) => {
        await chatThreadClient.updateMessage(messageId, { content });
      }),
      onDeleteMessage: ignoreChatErrorAsync(async (messageId: string) => {
        await chatThreadClient.deleteMessage(messageId);
      }),
      // This handler is designed for chatThread to consume
      onMessageSeen: ignoreChatErrorAsync(async (chatMessageId: string) => {
        await chatThreadClient.sendReadReceipt({ chatMessageId });
      }),
      onTyping: ignoreChatErrorAsync(async () => {
        await chatThreadClient.sendTypingNotification();
      }),
      onParticipantRemove: ignoreChatErrorAsync(async (userId: string) => {
        await chatThreadClient.removeParticipant(fromFlatCommunicationIdentifier(userId));
      }),
      updateThreadTopicName: ignoreChatErrorAsync(async (topicName: string) => {
        await chatThreadClient.updateTopic(topicName);
      }),
      // [xkcd] TODO: This shouldn't return a boolean. Components should rely on state updates instead.
      onLoadPreviousChatMessages: async (messagesToLoad: number) => {
        if (messageIterator === undefined) {
          // Lazy definition so that errors in the method call are reported correctly.
          // Also allows recovery via retries in case of transient errors.
          messageIterator = chatThreadClient.listMessages();
        }

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

// These could be shared functions between Chat and Calling
export const defaultHandlerCreator =
  (chatClient: StatefulChatClient, chatThreadClient: ChatThreadClient) =>
  <Props>(_: (props: Props) => ReactElement | null): Common<ChatHandlers, Props> => {
    return createDefaultChatHandlers(chatClient, chatThreadClient);
  };

export const createDefaultChatHandlersForComponent = <Props>(
  chatClient: StatefulChatClient,
  chatThreadClient: ChatThreadClient,
  _: (props: Props) => ReactElement | null
): Common<ChatHandlers, Props> => {
  return createDefaultChatHandlers(chatClient, chatThreadClient);
};

/**
 * Wraps a handler function to ignore all {@link ChatError} exceptions.
 *
 * @param handler Handler function to wrap.
 */
const ignoreChatErrorAsync = <Args extends unknown[]>(
  handler: (...args: Args) => Promise<void>
): ((...args: Args) => Promise<void>) => {
  return async (...args: Args): Promise<void> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ChatError) {
        // Errors are already teed to the state and events by the stateful client and adapter.
        // Errors that escape here only create log spam in the console.
        return;
      }
      throw error;
    }
  };
};
