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
import { CaptionsAndRealTimeTextComponents } from './captionsAndRealTimeTextComponents';

/**
 * Props for the CaptionsAndRealTimeTextComponents that you can use in your application.
 *
 * @public
 */
export type CaptionsAndRealTimeTextComponentsProps = {
  callClient: StatefulCallClient;
  callAgent: CallAgent;
  call: Call;
  showCaptionsSettingsModal: boolean;
  showRealTimeTextModal: boolean;
};

/**
 * Loader function for the Captions and Real Time Text Components that you can use in your application. This
 * function will load the Captions and Real Time Text Components into the provided HTML element. The best use case for this
 * is in a Node ui framework that is not React based.
 *
 * @public
 */
export const loadCaptionsAndRealTimeTextComponent = async function (
  loaderArgs: CaptionsAndRealTimeTextComponentsProps,
  htmlElement: HTMLElement
): Promise<void> {
  initializeIcons();

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(CaptionsAndRealTimeTextComponents, { ...loaderArgs }));
};
