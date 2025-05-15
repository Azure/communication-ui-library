// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { parseReactVersion } from './utils';

const reactVersion = React.version;
parseReactVersion(reactVersion);

import { createRoot } from 'react-dom/client';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallWithChatAdapter,
  CallAndChatLocator,
  CallWithChatCompositeOptions,
  createAzureCommunicationCallWithChatAdapter,
  CallWithChatComposite,
  AzureCommunicationCallAdapterOptions
} from '@internal/react-composites';
import { initializeIcons } from '@fluentui/react';

/**
 * Props for the CallWithChatComposite that you can use in your application.
 *
 * Contains two options bags:
 * - adapterOptions: Options for the {@link AzureCommunicationCallAdapterOptions}
 * - callCompositeOptions: Options for the {@link CallWithChatComposite} {@link CallWithChatCompositeOptions}
 * @public
 */
export type CallWithChatCompositeLoaderProps = {
  userId: CommunicationUserIdentifier;
  credential: CommunicationTokenCredential;
  displayName: string;
  endpoint: string;
  locator: CallAndChatLocator;
  callAdapterOptions?: AzureCommunicationCallAdapterOptions;
  callWithChatCompositeOptions?: CallWithChatCompositeOptions;
};

/**
 * Props for the CallWithChatComposite that you can use in your application. This
 * function will load the CallWithChatComposite into the provided HTML element.
 * The best use case for this is in a Node UI framework that is not React based.
 *
 * @public
 */
export const loadCallWithChatComposite = async function (
  loaderArgs: CallWithChatCompositeLoaderProps,
  htmlElement: HTMLElement
): Promise<CallWithChatAdapter | undefined> {
  initializeIcons();
  const { userId, credential, displayName, endpoint, locator, callAdapterOptions, callWithChatCompositeOptions } =
    loaderArgs;
  const adapter = await createAzureCommunicationCallWithChatAdapter({
    userId,
    displayName: displayName ?? 'anonymous',
    credential,
    endpoint: endpoint,
    locator: locator,
    callAdapterOptions
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(
    React.createElement(CallWithChatComposite, { options: callWithChatCompositeOptions, adapter }, null)
  );
  return adapter;
};
