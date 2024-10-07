// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { parseReactVersion } from './utils';

const reactVersion = React.version;
parseReactVersion(reactVersion);

import { createRoot } from 'react-dom/client';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallWithChatAdapter,
  CallAndChatLocator,
  CallWithChatCompositeOptions,
  createAzureCommunicationCallWithChatAdapter,
  CallWithChatComposite
} from '@internal/react-composites';
import { initializeIcons } from '@fluentui/react';

/**
 * Props for the CallWithChatComposite that you can use in your application.
 * @beta
 */
export type CallWithChatCompositeLoaderProps = {
  userId: string;
  token: string;
  displayName: string;
  endpoint: string;
  locator: CallAndChatLocator;
};

/**
 * Props for the CallWithChatComposite that you can use in your application.
 * @beta
 */
export const loadCallWithChatComposite = async function (
  args: CallWithChatCompositeLoaderProps,
  htmlElement: HTMLElement | null,
  props: CallWithChatCompositeOptions
): Promise<CallWithChatAdapter | undefined> {
  initializeIcons();
  const { userId, token, displayName, endpoint, locator } = args;
  const adapter = await createAzureCommunicationCallWithChatAdapter({
    userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    endpoint: endpoint,
    locator: locator
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(CallWithChatComposite, { options: props, adapter }, null));
  return adapter;
};
