// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { CallClientProvider, CallAgentProvider, CallProvider } from '@internal/calling-component-bindings';
import CaptionsBannerComponent from './CaptionsBannerComponent';
import { CaptionsAndRealTimeTextComponentsProps } from './captionsAndRealTimeTextComponentsLoader';

/**
 * return calling components.
 *
 * @internal
 */
export const CaptionsAndRealTimeTextComponents = (props: CaptionsAndRealTimeTextComponentsProps): JSX.Element => {
  const { callClient, callAgent, call, showCaptionsSettingsModal, showRealTimeTextModal } = props;

  return (
    <div>
      {callClient && callAgent && call && (
        <CallClientProvider callClient={callClient}>
          <CallAgentProvider callAgent={callAgent}>
            <CallProvider call={call}>
              <CaptionsBannerComponent
                showCaptionsSettingsModal={showCaptionsSettingsModal}
                showRealTimeTextModal={showRealTimeTextModal}
              />
            </CallProvider>
          </CallAgentProvider>
        </CallClientProvider>
      )}
    </div>
  );
};
