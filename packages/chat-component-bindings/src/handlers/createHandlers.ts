// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ReactElement } from 'react';
import { Common, fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { ChatErrorTarget, newClearChatErrorsModifier, StatefulChatClient } from '@internal/chat-stateful-client';
import { ErrorType } from '@internal/react-components';
import { ChatMessage, ChatThreadClient } from '@azure/communication-chat';
import memoizeOne from 'memoize-one';

export type ChatHandlers = {
  onSendMessage: (content: string) => Promise<void>;
  onMessageSeen: (chatMessageId: string) => Promise<void>;
  onTyping: () => Promise<void>;
  onParticipantRemove: (userId: string) => Promise<void>;
  updateThreadTopicName: (topicName: string) => Promise<void>;
  onLoadPreviousChatMessages: (messagesToLoad: number) => Promise<boolean>;
  onDismissErrors: (errorTypes: ErrorType[]) => void;
};

// Keep all these handlers the same instance(unless client changed) to avoid re-render
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
      },
      onDismissErrors: (errorTypes: ErrorType[]) => {
        const targets: Set<ChatErrorTarget> = new Set();
        for (const errorType of errorTypes) {
          switch (errorType) {
            case 'unableToReachChatService':
            case 'accessDenied':
            case 'userNotInThisThread':
            case 'sendMessageNotInThisThread':
              addAccessErrorTargets(targets);
              break;
            case 'sendMessageGeneric':
              targets.add('ChatThreadClient.sendMessage');
              break;
          }
        }
        chatClient.modifyState(newClearChatErrorsModifier(Array.from(targets.values())));
      }
    };
  }
);

const accessErrorTargets: ChatErrorTarget[] = [
  'ChatThreadClient.getProperties',
  'ChatThreadClient.listMessages',
  'ChatThreadClient.listParticipants',
  'ChatThreadClient.sendMessage',
  'ChatThreadClient.sendTypingNotification'
];

const addAccessErrorTargets = (targets: Set<ChatErrorTarget>): void => {
  for (const target of accessErrorTargets) {
    targets.add(target);
  }
};

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
