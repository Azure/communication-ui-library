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
 *
 * Contains two options bags:
 * - adapterOptions: Options for the {@link AzureCommunicationCallAdapter}
 * - callCompositeOptions: Options for the {@link CallComposite} {@link CallCompositeOptions}
 *
 * @public
 */
export type CallCompositeLoaderProps = {
  userId: string;
  token: string;
  displayName: string;
  locator: CallAdapterLocator;
  adapterOptions?: AzureCommunicationCallAdapterOptions;
  callCompositeOptions?: CallCompositeOptions;
};

/**
 * Loader function for the CallComposite that you can use in your application. This
 * function will load the CallComposite into the provided HTML element. The best use case for this
 * is in a Node ui framework that is not React based.
 *
 * @public
 */
export const loadCallComposite = async function (
  loaderArgs: CallCompositeLoaderProps,
  htmlElement: HTMLElement
): Promise<CallAdapter | undefined> {
  initializeIcons();
  const { userId, token, displayName, locator, adapterOptions, callCompositeOptions } = loaderArgs;

  const adapter = await createAzureCommunicationCallAdapter({
    userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    locator,
    options: adapterOptions
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(CallComposite, { options: callCompositeOptions, adapter }, null));
  return adapter;
};
