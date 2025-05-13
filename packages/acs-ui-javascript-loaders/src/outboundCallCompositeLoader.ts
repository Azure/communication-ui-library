// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { parseReactVersion } from './utils';

const reactVersion = React.version;
parseReactVersion(reactVersion);

import { createRoot } from 'react-dom/client';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallComposite,
  createAzureCommunicationCallAdapter,
  CallCompositeOptions,
  StartCallIdentifier,
  AzureCommunicationCallAdapterOptions,
  CallAdapter,
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
export interface OutboundCallCompositeLoaderProps extends Partial<BaseCompositeProps<CallCompositeIcons>> {
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
   * Participants that will be called.
   * This can be a list of either {@link CommunicationUserIdentifier} or string identifiers.
   */
  targetCallees: string[] | StartCallIdentifier[];
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
   * This is used to configure the call composite.
   */
  formFactor?: 'mobile' | 'desktop';
}

/**
 * Loader function for the OutboundCallComposite that you can use in your application. This
 * function will load the CallComposite into the provided HTML element to make outbound calls.
 * The best use case for this is in a Node UI framework that is not React based.
 *
 * @public
 */
export const loadOutboundCallComposite = async function (
  loaderArgs: OutboundCallCompositeLoaderProps,
  htmlElement: HTMLElement
): Promise<CallAdapter | undefined> {
  initializeIcons();
  const {
    userId,
    credential,
    displayName,
    targetCallees,
    callAdapterOptions,
    callCompositeOptions,
    fluentTheme,
    formFactor,
    icons,
    locale,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    rtl
  } = loaderArgs;
  const formattedTargetCallees =
    typeof targetCallees[0] === 'string'
      ? (targetCallees as string[]).map((callee: string) => {
          return fromFlatCommunicationIdentifier(callee);
        })
      : undefined;

  const adapter = await createAzureCommunicationCallAdapter({
    userId,
    displayName: displayName ?? 'anonymous',
    credential,
    targetCallees: (formattedTargetCallees as StartCallIdentifier[]) ?? (targetCallees as StartCallIdentifier[]),
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
        fluentTheme,
        formFactor,
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
