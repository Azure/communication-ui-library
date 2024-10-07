// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { parseReactVersion } from './utils';

const reactVersion = React.version;
parseReactVersion(reactVersion);

import { createRoot } from 'react-dom/client';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  ChatCompositeOptions,
  createAzureCommunicationChatAdapter
} from '@internal/react-composites';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { initializeIcons } from '@fluentui/react';

/**
 * Props for the ChatComposite that you can use in your application.
 * @beta
 */
export type ChatCompositeLoaderProps = {
  userId: string;
  token: string;
  displayName?: string;
  endpoint: string;
  threadId: string;
};

/**
 * Loader function for the ChatComposite that you can use in your application.
 * @beta
 */
export const loadChatComposite = async function (
  args: ChatCompositeLoaderProps,
  htmlElement: HTMLElement | null,
  props: ChatCompositeOptions
): Promise<ChatAdapter | undefined> {
  initializeIcons();
  const { userId, token, endpoint, threadId, displayName } = args;
  const adapter = await createAzureCommunicationChatAdapter({
    endpoint,
    userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    threadId
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(ChatComposite, { options: props, adapter }, null));
  return adapter;
};
