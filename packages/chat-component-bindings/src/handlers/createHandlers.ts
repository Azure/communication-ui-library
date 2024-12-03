// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { ReactElement } from 'react';
import { Common, fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { StatefulChatClient } from '@internal/chat-stateful-client';
/* @conditional-compile-remove(file-sharing-acs) */
import { ChatAttachment } from '@azure/communication-chat';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { UploadChatImageResult } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { getImageAttachmentsFromHTMLContent } from '../utils/getImageAttachmentsFromHTMLContent';
import { ChatMessage, ChatMessageReadReceipt, ChatThreadClient, SendMessageOptions } from '@azure/communication-chat';
import memoizeOne from 'memoize-one';
/* @conditional-compile-remove(file-sharing-acs) */
import { MessageOptions } from '@internal/acs-ui-common';

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
    options?: SendMessageOptions | /* @conditional-compile-remove(file-sharing-acs) */ MessageOptions
  ) => Promise<void>;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onUploadImage: (image: Blob, imageFilename: string) => Promise<UploadChatImageResult>;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  onDeleteImage: (imageId: string) => Promise<void>;
  onMessageSeen: (chatMessageId: string) => Promise<void>;
  onTyping: () => Promise<void>;
  onRemoveParticipant: (userId: string) => Promise<void>;
  updateThreadTopicName: (topicName: string) => Promise<void>;
  onLoadPreviousChatMessages: (messagesToLoad: number) => Promise<boolean>;
  onUpdateMessage: (
    messageId: string,
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    options?: MessageOptions
  ) => Promise<void>;
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
    let readReceiptIterator: PagedAsyncIterableIterator<ChatMessageReadReceipt> | undefined = undefined;
    return {
      // due to a bug in babel, we can't use arrow function here
      // affecting conditional-compile-remove(attachment-upload)
      onSendMessage: async function (
        content: string,
        options?: SendMessageOptions | /* @conditional-compile-remove(file-sharing-acs) */ MessageOptions
      ) {
        const sendMessageRequest = {
          content,
          senderDisplayName: chatClient.getState().displayName
        };

        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        const imageAttachments: ChatAttachment[] | undefined = getImageAttachmentsFromHTMLContent(content);

        /* @conditional-compile-remove(file-sharing-acs) */
        const hasAttachments =
          options &&
          'attachments' in options &&
          options.attachments &&
          options.attachments[0] &&
          !(options.attachments[0] as ChatAttachment).attachmentType;
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        const hasImages = imageAttachments && imageAttachments.length > 0;

        /* @conditional-compile-remove(file-sharing-acs) */
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        if (
          /* @conditional-compile-remove(file-sharing-acs) */ hasAttachments ||
          /* @conditional-compile-remove(rich-text-editor-image-upload) */ hasImages
        ) {
          const chatSDKOptions: SendMessageOptions = {
            metadata: {
              ...options?.metadata,
              /* @conditional-compile-remove(file-sharing-acs) */
              fileSharingMetadata: JSON.stringify(options?.attachments)
            },
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            attachments: imageAttachments,
            type: options?.type
          };
          await chatThreadClient.sendMessage(sendMessageRequest, chatSDKOptions);
          return;
        }

        await chatThreadClient.sendMessage(sendMessageRequest, options as SendMessageOptions);
      },
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      onUploadImage: async function (image: Blob, imageFilename: string): Promise<UploadChatImageResult> {
        const imageResult = await chatThreadClient.uploadImage(image, imageFilename);
        return imageResult;
      },
      /* @conditional-compile-remove(rich-text-editor-image-upload) */
      onDeleteImage: async function (imageId: string): Promise<void> {
        try {
          await chatThreadClient.deleteImage(imageId);
        } catch (e) {
          console.log(`Error deleting image message: ${e}`);
        }
        return;
      },
      // due to a bug in babel, we can't use arrow function here
      // affecting conditional-compile-remove(attachment-upload)
      onUpdateMessage: async function (
        messageId: string,
        content: string,
        /* @conditional-compile-remove(file-sharing-acs) */
        options?: MessageOptions
      ) {
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        const imageAttachments: ChatAttachment[] | undefined = getImageAttachmentsFromHTMLContent(content);

        const updateMessageOptions = {
          content,
          /* @conditional-compile-remove(file-sharing-acs) */
          metadata: {
            ...options?.metadata,
            fileSharingMetadata: JSON.stringify(options?.attachments)
          },
          /* @conditional-compile-remove(rich-text-editor-image-upload) */
          attachments: imageAttachments
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
