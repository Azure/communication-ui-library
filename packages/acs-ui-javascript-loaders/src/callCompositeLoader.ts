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
  CallComposite,
  createAzureCommunicationCallAdapter,
  AzureCommunicationCallAdapterOptions,
  CallAdapter,
  CallAdapterLocator,
  CallCompositeOptions
} from '@internal/react-composites';
import { initializeIcons } from '@fluentui/react';

/**
 * Props for the OutboundCallComposite that you can use in your application.
 * @public
 */
export type CallCompositeLoaderProps = {
  userId: string;
  token: string;
  displayName: string;
  locator: CallAdapterLocator;
  options?: AzureCommunicationCallAdapterOptions;
};

/**
 * Loader function for the OutboundCallComposite that you can use in your application.
 *
 * @public
 */
export const loadCallComposite = async function (
  adapterArgs: CallCompositeLoaderProps,
  htmlElement: HTMLElement | null,
  props?: CallCompositeOptions
): Promise<CallAdapter | undefined> {
  initializeIcons();
  const { userId, token, displayName, locator, options } = adapterArgs;

  const adapter = await createAzureCommunicationCallAdapter({
    userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    locator,
    options
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(CallComposite, { ...props, adapter }, null));
  return adapter;
};
