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
import { initializeIcons } from '@fluentui/react';

/**
 * Props for the ChatComposite that you can use in your application. Contains the
 * options for the {@link ChatComposite} {@link ChatCompositeOptions}.
 * @public
 */
export type ChatCompositeLoaderProps = {
  userId: CommunicationUserIdentifier;
  credential: AzureCommunicationTokenCredential;
  displayName?: string;
  endpoint: string;
  threadId: string;
  chatCompositeOptions?: ChatCompositeOptions;
};

/**
 * Loader function for the ChatComposite that you can use in your application. This
 * function will load the ChatComposite into the provided HTML element.
 * The best use case for this is in a Node UI framework that is not React based.
 *
 * @public
 */
export const loadChatComposite = async function (
  loaderArgs: ChatCompositeLoaderProps,
  htmlElement: HTMLElement
): Promise<ChatAdapter | undefined> {
  initializeIcons();
  const { userId, credential, endpoint, threadId, displayName, chatCompositeOptions } = loaderArgs;
  const adapter = await createAzureCommunicationChatAdapter({
    endpoint,
    userId,
    displayName: displayName ?? 'anonymous',
    credential,
    threadId
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(ChatComposite, { options: chatCompositeOptions, adapter }, null));
  return adapter;
};
