// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { parseReactVersion } from './utils';

const reactVersion = React.version;
parseReactVersion(reactVersion);

import { createRoot } from 'react-dom/client';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallComposite,
  createAzureCommunicationCallAdapter,
  AzureCommunicationCallAdapterOptions,
  CallAdapter,
  CallAdapterLocator,
  CallCompositeOptions,
  BaseCompositeProps,
  CallCompositeIcons
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
export interface CallCompositeLoaderProps extends Partial<BaseCompositeProps<CallCompositeIcons>> {
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
   * locator for the call
   */
  locator: CallAdapterLocator;
  /**
   * Options for the {@link AzureCommunicationCallAdapter}
   * This is used to configure the call adapter.
   */
  callAdapterOptions?: AzureCommunicationCallAdapterOptions;
  /**
   * Options for the {@link CallComposite} {@link CallCompositeOptions}
   * This is used to configure the call composite.
   */
  callCompositeOptions?: CallCompositeOptions;
  /**
   * Device form factor for the composite.
   */
  formFactor?: 'mobile' | 'desktop';
}

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
  const {
    userId,
    credential,
    displayName,
    locator,
    callAdapterOptions,
    callCompositeOptions,
    formFactor,
    fluentTheme,
    icons,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    rtl,
    locale
  } = loaderArgs;
  const adapter = await createAzureCommunicationCallAdapter({
    userId,
    displayName: displayName ?? 'anonymous',
    credential,
    locator,
    options: callAdapterOptions
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(
    React.createElement(
      CallComposite,
      {
        options: callCompositeOptions,
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
