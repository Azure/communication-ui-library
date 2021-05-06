// © Microsoft Corporation. All rights reserved.

import { CommonProperties, DefaultHandlers } from '@azure/acs-chat-selector';

import { ReactElement } from 'react';
import memoizeOne from 'memoize-one';
import { GroupChatAdapter } from '../adapter/GroupChatAdapter';
import { useAdapter } from '../adapter/GroupChatAdapterProvider';

// This will be moved into selector folder when ChatClientProvide when refactor finished
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _component: (props: PropsT) => ReactElement | null
): Pick<DefaultHandlers, CommonProperties<DefaultHandlers, PropsT>> => {
  return createCompositeHandlers(useAdapter());
};

const createCompositeHandlers = memoizeOne(
  (adapter: GroupChatAdapter): DefaultHandlers => ({
    onMessageSend: adapter.sendMessage,
    onLoadPreviousChatMessages: adapter.loadPreviousChatMessages,
    onMessageSeen: adapter.sendReadReceipt,
    onTyping: adapter.sendTypingIndicator,
    removeThreadMember: adapter.removeThreadMember,
    updateThreadTopicName: adapter.updateThreadTopicName
  })
);
