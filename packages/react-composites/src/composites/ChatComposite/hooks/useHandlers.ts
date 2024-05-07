// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommonProperties } from '@internal/acs-ui-common';
import { ChatHandlers } from '@internal/chat-component-bindings';

import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';
import { ChatAdapter } from '../adapter/ChatAdapter';
import { useAdapter } from '../adapter/ChatAdapterProvider';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadata } from '@internal/react-components';

/**
 * @private
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _component: (props: PropsT) => ReactElement | null
): Pick<ChatHandlers, CommonProperties<ChatHandlers, PropsT>> => {
  return createCompositeHandlers(useAdapter());
};

const createCompositeHandlers = memoizeOne(
  (adapter: ChatAdapter): ChatHandlers => ({
    // have to use `any` here so we don't import from Chat SDK
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSendMessage: (content: string, options: any) => {
      if (options && 'attachmentMetadata' in options) {
        return adapter.sendMessage(content, {
          attachments: options.attachmentMetadata
        });
      } else {
        return adapter.sendMessage(content, options);
      }
    },
    onLoadPreviousChatMessages: adapter.loadPreviousChatMessages,
    onMessageSeen: adapter.sendReadReceipt,
    onTyping: adapter.sendTypingIndicator,
    onRemoveParticipant: adapter.removeParticipant,
    updateThreadTopicName: adapter.setTopic,
    onUpdateMessage: (
      messageId: string,
      content: string,
      /* @conditional-compile-remove(attachment-upload) */
      options?: {
        attachmentMetadata?: AttachmentMetadata[];
      }
    ) => {
      let metadata = undefined;
      /* @conditional-compile-remove(attachment-upload) */
      metadata = {
        filesharingMetadata: JSON.stringify(options?.attachmentMetadata)
      };
      /* @conditional-compile-remove(attachment-upload) */
      const updatedOptions = {
        attachmentMetadata: options?.attachmentMetadata
      };
      return adapter.updateMessage(
        messageId,
        content,
        metadata,
        /* @conditional-compile-remove(attachment-upload) */ updatedOptions
      );
    },
    onDeleteMessage: adapter.deleteMessage
  })
);
