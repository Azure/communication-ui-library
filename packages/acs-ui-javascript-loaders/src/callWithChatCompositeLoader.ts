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
  AzureCommunicationCallAdapterOptions,
  BaseCompositeProps,
  CallWithChatCompositeIcons
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
export interface CallWithChatCompositeLoaderProps extends Partial<BaseCompositeProps<CallWithChatCompositeIcons>> {
  /**
   * UserId for the local user.
   */
  userId: CommunicationUserIdentifier;
  /**
   * CommunicationTokenCredential for the local user.
   */
  credential: CommunicationTokenCredential;
  /**
   * Display name for the local user.
   */
  displayName: string;
  /**
   * Azure communication service endpoint. This used for the token and joining the chat thread.
   */
  endpoint: string;
  /**
   * Locator for the call and the chat thread.
   * This is used to join the call and the chat thread.
   */
  locator: CallAndChatLocator;
  /**
   * Options for the {@link AzureCommunicationCallAdapterOptions}
   * This is used to configure the call adapter.
   */
  callAdapterOptions?: AzureCommunicationCallAdapterOptions;
  /**
   * Options for the {@link CallWithChatComposite} {@link CallWithChatCompositeOptions}
   * This is used to configure the call composite.
   */
  callWithChatCompositeOptions?: CallWithChatCompositeOptions;
  /**
   * Device form factor for the composite.
   */
  formFactor?: 'mobile' | 'desktop';
}

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
  const {
    userId,
    credential,
    displayName,
    endpoint,
    locator,
    callAdapterOptions,
    callWithChatCompositeOptions,
    formFactor,
    fluentTheme,
    locale,
    icons,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    rtl
  } = loaderArgs;
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
    React.createElement(
      CallWithChatComposite,
      {
        options: callWithChatCompositeOptions,
        adapter,
        formFactor,
        fluentTheme,
        icons,
        locale,
        onFetchAvatarPersonaData,
        onFetchParticipantMenuItems,
        rtl
      },
      null
    )
  );
  return adapter;
};
