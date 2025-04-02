// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { parseReactVersion } from './utils';

const reactVersion = React.version;
parseReactVersion(reactVersion);

import { createRoot } from 'react-dom/client';
import { initializeIcons } from '@fluentui/react';
import { CallAgent, Call } from '@azure/communication-calling';
import { StatefulCallClient } from '@internal/calling-stateful-client';
import { CallComponents } from './callComponents';

/**
 * Props for the OutboundCallComposite that you can use in your application.
 *
 * Contains two options bags:
 * - adapterOptions: Options for the {@link AzureCommunicationCallAdapter}
 * - callCompositeOptions: Options for the {@link CallComposite} {@link CallCompositeOptions}
 *
 * @public
 */
export type CallComponentLoaderProps = {
  callClient: StatefulCallClient;
  callAgent: CallAgent;
  call: Call;
};

/**
 * Loader function for the CallComposite that you can use in your application. This
 * function will load the CallComposite into the provided HTML element. The best use case for this
 * is in a Node ui framework that is not React based.
 *
 * @public
 */
export const loadCallComponent = async function (
  loaderArgs: CallComponentLoaderProps,
  htmlElement: HTMLElement
): Promise<void> {
  initializeIcons();
  const { callClient, callAgent, call } = loaderArgs;

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(CallComponents, { callClient, callAgent, call }));
};
