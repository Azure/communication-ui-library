// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { parseReactVersion } from './utils';

const reactVersion = React.version;
parseReactVersion(reactVersion);

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallComposite,
  createAzureCommunicationCallAdapter,
  CallCompositeOptions,
  StartCallIdentifier,
  AzureCommunicationCallAdapterOptions,
  CallAdapter
} from '@internal/react-composites';
import { initializeIcons } from '@fluentui/react';

/**
 * Props for the OutboundCallComposite that you can use in your application.
 * @beta
 */
export type OutboundCallCompositeLoaderProps = {
  userId: string;
  token: string;
  displayName: string;
  targetCallees: string[] | StartCallIdentifier[];
  options?: AzureCommunicationCallAdapterOptions;
};

/**
 * Loader function for the OutboundCallComposite that you can use in your application.
 *
 * @beta
 */
export const loadOutboundCallComposite = async function (
  adapterArgs: OutboundCallCompositeLoaderProps,
  htmlElement: HTMLElement | null,
  props?: CallCompositeOptions
): Promise<CallAdapter | undefined> {
  initializeIcons();
  const { userId, token, displayName, targetCallees, options } = adapterArgs;
  const formattedTargetCallees =
    typeof targetCallees[0] === 'string'
      ? (targetCallees as string[]).map((callee: string) => {
          return fromFlatCommunicationIdentifier(callee);
        })
      : undefined;

  const adapter = await createAzureCommunicationCallAdapter({
    userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    targetCallees: (formattedTargetCallees as StartCallIdentifier[]) ?? (targetCallees as StartCallIdentifier[]),
    options
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }
  const { createRoot } = await import('react-dom/client');
  createRoot(htmlElement).render(React.createElement(CallComposite, { ...props, adapter }, null));
  return adapter;
};
