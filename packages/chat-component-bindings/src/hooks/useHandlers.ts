// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { createDefaultChatHandlersForComponent } from '../handlers/createHandlers';
import { ChatClientContext } from '../providers/ChatClientProvider';
import { ChatThreadClientContext } from '../providers/ChatThreadClientProvider';
import { ReactElement, useContext } from 'react';
import { Common } from '@internal/acs-ui-common';
import { ChatHandlers } from '../handlers/createHandlers';

/**
 * Hook to obtain a handler for a specified component.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useHandlers = <PropsT>(
  component: (props: PropsT) => ReactElement | null
): Common<ChatHandlers, PropsT> | undefined => {
  const chatClient = useContext(ChatClientContext);
  const chatThreadClient = useContext(ChatThreadClientContext);
  if (!chatThreadClient || !chatClient) {
    return undefined;
  }

  return createDefaultChatHandlersForComponent(chatClient, chatThreadClient, component);
};
