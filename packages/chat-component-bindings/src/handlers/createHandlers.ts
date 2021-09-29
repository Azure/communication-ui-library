// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ReactElement } from 'react';
import { Common, fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { StatefulChatClient } from '@internal/chat-stateful-client';
import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import memoizeOne from 'memoize-one';

/**
 * Object containing all the handlers required for chat components.
 *
 * Chat related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @public
 */
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

/**
 * Create the default implementation of {@link ChatHandlers}.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * Returned object is memoized to avoid rerenders when used as props for React Components.
 *
 * @public
 */
export const createDefaultChatHandlers = memoizeOne(
  (chatClient: StatefulChatClient, chatThreadClient: ChatThreadClient): ChatHandlers => {
    let messageIterator: PagedAsyncIterableIterator<ChatMessage> | undefined = undefined;
    return {
      onSendMessage: async (content: string) => {
        const sendMessageRequest = {
          content,
          senderDisplayName: chatClient.getState().displayName
        };
        await chatThreadClient.sendMessage(sendMessageRequest);
      },
      onUpdateMessage: async (messageId: string, content: string) => {
        await chatThreadClient.updateMessage(messageId, { content });
      },
      onDeleteMessage: async (messageId: string) => {
        await chatThreadClient.deleteMessage(messageId);
      },
      // This handler is designed for chatThread to consume
      onMessageSeen: async (chatMessageId: string) => {
        await chatThreadClient.sendReadReceipt({ chatMessageId });
      },
      onTyping: async () => {
        await chatThreadClient.sendTypingNotification();
      },
      onParticipantRemove: async (userId: string) => {
        await chatThreadClient.removeParticipant(fromFlatCommunicationIdentifier(userId));
      },
      updateThreadTopicName: async (topicName: string) => {
        await chatThreadClient.updateTopic(topicName);
      },
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

/**
 * Create a set of default handlers for given component.
 *
 * Returned object is memoized (with reference to the arguments) to avoid
 * renders when used as props for React Components.
 *
 * @public
 */
export const createDefaultChatHandlersForComponent = <Props>(
  chatClient: StatefulChatClient,
  chatThreadClient: ChatThreadClient,
  _: (props: Props) => ReactElement | null
): Common<ChatHandlers, Props> => {
  return createDefaultChatHandlers(chatClient, chatThreadClient);
};
