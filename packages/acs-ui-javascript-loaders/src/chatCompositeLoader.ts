// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

const reactVersion = React.version;
const parseReactVersion = (version: string | undefined): number[] => {
  if (!version) {
    return [];
  }
  return version.split('.').map((v) => parseInt(v));
};
if (parseReactVersion(reactVersion)[0] && parseReactVersion(reactVersion)[0] < 18) {
  throw new Error(
    'React version is less than 18. Please upgrade to React 18 or alternatively checkout how to use our composites directly here: https://azure.github.io/communication-ui-library/?path=/docs/quickstarts-composites--page'
  );
}

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

  createRoot(htmlElement).render(React.createElement(ChatComposite, { ...props, adapter }, null));
  return adapter;
};
