// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommonProperties } from '@internal/acs-ui-common';
import { ChatHandlers } from '@internal/chat-component-bindings';

import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';
import { ChatAdapter } from '../adapter/ChatAdapter';
import { useAdapter } from '../adapter/ChatAdapterProvider';

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
    onSendMessage: adapter.sendMessage,
    onLoadPreviousChatMessages: adapter.loadPreviousChatMessages,
    onMessageSeen: adapter.sendReadReceipt,
    onTyping: adapter.sendTypingIndicator,
    onRemoveParticipant: adapter.removeParticipant,
    updateThreadTopicName: adapter.setTopic,
    onUpdateMessage: (messageId, content, options?) => {
      const metadata = options?.metadata;
      const updatedOptions = options?.attachedFilesMetadata ? { ...options.attachedFilesMetadata } : {};
      return adapter.updateMessage(messageId, content, metadata, updatedOptions);
    },
    onDeleteMessage: adapter.deleteMessage
  })
);
