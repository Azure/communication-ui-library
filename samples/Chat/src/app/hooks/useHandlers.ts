// © Microsoft Corporation. All rights reserved.

import { DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { createDefaultHandlersForComponent } from '@azure/acs-chat-selector';

import { useChatClient, useChatThreadClient } from '@azure/communication-ui';

import { ReactElement } from 'react';

// This will be moved into selector folder when ChatClientProvide when refactor finished
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(component: (props: PropsT) => ReactElement | null) => {
  const chatClient: DeclarativeChatClient = useChatClient() as any;
  const chatThreadClient = useChatThreadClient();
  if (!chatThreadClient) {
    throw 'Please initialize chatThreadClient first!';
  }

  return createDefaultHandlersForComponent(chatClient, chatThreadClient, component);
};
