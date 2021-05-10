// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { createDefaultChatHandlersForComponent } from '../handlers/createHandlers';

import { useChatClient } from '../providers/ChatClientProvider';
import { useChatThreadClient } from '../providers/ChatThreadClientProvider';

import { ReactElement } from 'react';

// @ts-ignore
import { DefaultChatHandlers } from '../handlers/createHandlers';
// @ts-ignore
import { CommonProperties } from '../handlers/createHandlers';

// This will be moved into selector folder when ChatClientProvide when refactor finished
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(component: (props: PropsT) => ReactElement | null) => {
  const chatClient: DeclarativeChatClient = useChatClient() as any;
  const chatThreadClient = useChatThreadClient();
  if (!chatThreadClient) {
    throw 'Please initialize chatThreadClient first!';
  }

  return createDefaultChatHandlersForComponent(chatClient, chatThreadClient, component);
};
