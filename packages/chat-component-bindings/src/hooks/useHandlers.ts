// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { StatefulChatClient } from 'chat-stateful-client';
import { createDefaultChatHandlersForComponent } from '../handlers/createHandlers';
import { useChatClient } from '../providers/ChatClientProvider';
import { useChatThreadClient } from '../providers/ChatThreadClientProvider';
import { ReactElement } from 'react';
import { Common } from 'acs-ui-common';
// @ts-ignore
import { DefaultChatHandlers } from '../handlers/createHandlers';

export const useHandlers = <PropsT>(
  component: (props: PropsT) => ReactElement | null
): Common<DefaultChatHandlers, PropsT> => {
  const chatClient: StatefulChatClient = useChatClient() as any;
  const chatThreadClient = useChatThreadClient();
  if (!chatThreadClient) {
    throw 'Please initialize chatThreadClient first!';
  }

  return createDefaultChatHandlersForComponent(chatClient, chatThreadClient, component);
};
