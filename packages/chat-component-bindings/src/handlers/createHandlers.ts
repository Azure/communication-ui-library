// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ReactElement } from 'react';
import { Common, fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { StatefulChatClient } from '@internal/chat-stateful-client';
import { ChatMessage, ChatMessageReadReceipt, ChatThreadClient, SendMessageOptions } from '@azure/communication-chat';
import memoizeOne from 'memoize-one';
import { AttachmentMetadata } from '@internal/react-components';

/**
 * Object containing all the handlers required for chat components.
 *
 * Chat related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @public
 */
export type ChatHandlers = {
  onSendMessage: (
    content: string,
    /**
     * @deprecated The usage of {@link SendMessageOptions} here is being deprecated,
     * moving forward, please use {@link UIComponentMessageOptions} instead
     *
     * options to set properties associated with chat messages
     */
    options?: SendMessageOptions | /* @conditional-compile-remove(attachment-upload) */ UIComponentMessageOptions
  ) => Promise<void>;
  onMessageSeen: (chatMessageId: string) => Promise<void>;
  onTyping: () => Promise<void>;
  onRemoveParticipant: (userId: string) => Promise<void>;
  updateThreadTopicName: (topicName: string) => Promise<void>;
  onLoadPreviousChatMessages: (messagesToLoad: number) => Promise<boolean>;
  onUpdateMessage: (
    messageId: string,
    content: string,
    /* @conditional-compile-remove(attachment-upload) */
    options?: UIComponentMessageOptions
  ) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
};

/**
 * @beta
 */
export type UIComponentMessageOptions = {
  attachmentMetadata?: AttachmentMetadata[];
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
    let readReceiptIterator: PagedAsyncIterableIterator<ChatMessageReadReceipt> | undefined = undefined;
    return {
      onSendMessage: async (content: string, options?: SendMessageOptions | UIComponentMessageOptions) => {
        let chatSDKOptions = {};
        // if attachmentMetadata is present in options,
        // then it is a UIComponentMessageOptions and
        // we need to convert it to SendMessageOptions from Chat SDK
        if (options && `attachmentMetadata` in options) {
          chatSDKOptions = {
            metadata: {
              fileSharingMetadata: JSON.stringify(options.attachmentMetadata)
            }
          };
        } else {
          chatSDKOptions = options as SendMessageOptions;
        }
        const sendMessageRequest = {
          content,
          senderDisplayName: chatClient.getState().displayName
        };
        await chatThreadClient.sendMessage(sendMessageRequest, chatSDKOptions);
      },
      onUpdateMessage: async (
        messageId: string,
        content: string,
        /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
        options?: UIComponentMessageOptions
      ) => {
        const updateMessageOptions = {
          content,
          metadata: {
            fileSharingMetadata: JSON.stringify(options?.attachmentMetadata)
          }
        };
        await chatThreadClient.updateMessage(messageId, updateMessageOptions);
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
      onRemoveParticipant: async (userId: string) => {
        await chatThreadClient.removeParticipant(fromFlatCommunicationIdentifier(userId));
      },
      updateThreadTopicName: async (topicName: string) => {
        await chatThreadClient.updateTopic(topicName);
      },
      onLoadPreviousChatMessages: async (messagesToLoad: number) => {
        if (messageIterator === undefined) {
          // Lazy definition so that errors in the method call are reported correctly.
          // Also allows recovery via retries in case of transient errors.
          messageIterator = chatThreadClient.listMessages({ maxPageSize: 50 });
        }
        if (readReceiptIterator === undefined) {
          readReceiptIterator = chatThreadClient.listReadReceipts();
        }
        // get the earliest message time
        let remainingMessagesToGet = messagesToLoad;
        let isAllChatMessagesLoaded = false;
        let earliestTime = Number.MAX_SAFE_INTEGER;
        while (remainingMessagesToGet >= 1) {
          const message = await messageIterator.next();
          if (message?.value?.id) {
            if (parseInt(message.value.id) < earliestTime) {
              earliestTime = parseInt(message.value.id);
            }
          }

          if (message.value?.type && message.value.type === 'text') {
            remainingMessagesToGet--;
          }

          // We have traversed all messages in this thread
          if (message.done) {
            isAllChatMessagesLoaded = true;
            break;
          }
        }
        // keep fetching read receipts until read receipt time < earlist message time
        let readReceipt = await readReceiptIterator.next();
        while (!readReceipt.done && parseInt(readReceipt?.value?.chatMessageId) >= earliestTime) {
          readReceipt = await readReceiptIterator.next();
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
