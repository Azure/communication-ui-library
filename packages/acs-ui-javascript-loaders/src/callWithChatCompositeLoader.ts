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

  createRoot(htmlElement).render(React.createElement(CallWithChatComposite, { ...props, adapter }, null));
  return adapter;
};
