// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommonProperties2, DefaultChatHandlers } from '@azure/acs-chat-selector';

import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';
import { GroupChatAdapter } from '../adapter/GroupChatAdapter';
import { useAdapter } from '../adapter/GroupChatAdapterProvider';

// This will be moved into selector folder when ChatClientProvide when refactor finished
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _component: (props: PropsT) => ReactElement | null
): Pick<DefaultChatHandlers, CommonProperties2<DefaultChatHandlers, PropsT>> => {
  return createCompositeHandlers(useAdapter());
};

const createCompositeHandlers = memoizeOne(
  (adapter: GroupChatAdapter): DefaultChatHandlers => ({
    onMessageSend: adapter.sendMessage,
    onLoadPreviousChatMessages: adapter.loadPreviousChatMessages,
    onMessageSeen: adapter.sendReadReceipt,
    onTyping: adapter.sendTypingIndicator,
    removeThreadMember: adapter.removeParticipant,
    updateThreadTopicName: adapter.setTopic,
    onRenderParticipantMenu: adapter.onRenderParticipantMenu
  })
);
