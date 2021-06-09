// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createDefaultChatHandlersForComponent } from '../handlers/createHandlers';
import { ChatClientContext } from '../providers/ChatClientProvider';
import { ChatThreadClientContext } from '../providers/ChatThreadClientProvider';
import { ReactElement, useContext } from 'react';
import { Common } from 'acs-ui-common';
// @ts-ignore
import { CommonProperties } from 'acs-ui-common';
// @ts-ignore
import { DefaultChatHandlers } from '../handlers/createHandlers';

export const useHandlers = <PropsT>(
  component: (props: PropsT) => ReactElement | null
): Common<DefaultChatHandlers, PropsT> | undefined => {
  const chatClient = useContext(ChatClientContext);
  const chatThreadClient = useContext(ChatThreadClientContext);
  if (!chatThreadClient || !chatClient) {
    return undefined;
  }

  return createDefaultChatHandlersForComponent(chatClient, chatThreadClient, component);
};
