// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommonProperties } from '@internal/acs-ui-common';
import { ChatHandlers } from '@internal/chat-component-bindings';

import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';
import { ChatAdapter } from '../adapter/ChatAdapter';
import { useAdapter } from '../adapter/ChatAdapterProvider';
/* @conditional-compile-remove(attachment-byos) */
import { MessageOptions } from '@internal/acs-ui-common';

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
      /* @conditional-compile-remove(attachment-byos) */
      if (
        options &&
        'attachments' in options &&
        options.attachments &&
        options.attachments[0] &&
        !('attachmentType' in options.attachments[0])
      ) {
        const adapterMessageOption = {
          metadata: {
            ...options?.metadata,
            fileSharingMetadata: JSON.stringify(options?.attachments)
          }
        };
        return adapter.sendMessage(content, adapterMessageOption);
      }
      return adapter.sendMessage(content, options);
    },
    onLoadPreviousChatMessages: adapter.loadPreviousChatMessages,
    onMessageSeen: adapter.sendReadReceipt,
    onTyping: adapter.sendTypingIndicator,
    onRemoveParticipant: adapter.removeParticipant,
    updateThreadTopicName: adapter.setTopic,
    onUpdateMessage: function (
      messageId: string,
      content: string,
      /* @conditional-compile-remove(attachment-byos) */
      options?: MessageOptions
    ) {
      /* @conditional-compile-remove(attachment-byos) */
      const adapterMessageOptions: MessageOptions = {
        attachments: options?.attachments
      };
      return adapter.updateMessage(
        messageId,
        content,
        /* @conditional-compile-remove(attachment-byos) */ adapterMessageOptions
      );
    },
    onDeleteMessage: adapter.deleteMessage
  })
);
