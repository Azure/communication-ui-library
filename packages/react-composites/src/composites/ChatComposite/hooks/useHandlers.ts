// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommonProperties, DefaultChatHandlers } from '@azure/acs-chat-selector';

import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';
import { ChatAdapter } from '../adapter/ChatAdapter';
import { useAdapter } from '../adapter/ChatAdapterProvider';

// This will be moved into selector folder when ChatClientProvide when refactor finished
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _component: (props: PropsT) => ReactElement | null
): Pick<DefaultChatHandlers, CommonProperties<DefaultChatHandlers, PropsT>> => {
  return createCompositeHandlers(useAdapter());
};

const createCompositeHandlers = memoizeOne(
  (adapter: ChatAdapter): DefaultChatHandlers => ({
    onMessageSend: adapter.sendMessage,
    onLoadPreviousChatMessages: adapter.loadPreviousChatMessages,
    onMessageSeen: adapter.sendReadReceipt,
    onTyping: adapter.sendTypingIndicator,
    onParticipantRemove: adapter.removeParticipant,
    updateThreadTopicName: adapter.setTopic
  })
);
