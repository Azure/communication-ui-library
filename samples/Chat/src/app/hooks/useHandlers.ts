// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  StatefulChatClient,
  createDefaultChatHandlersForComponent,
  useChatClient,
  useChatThreadClient
} from '@azure/communication-react';

import { ReactElement } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useHandlers = <PropsT>(component: (props: PropsT) => ReactElement | null) => {
  const chatClient: StatefulChatClient = useChatClient();
  const chatThreadClient = useChatThreadClient();

  return createDefaultChatHandlersForComponent(chatClient, chatThreadClient, component);
};
