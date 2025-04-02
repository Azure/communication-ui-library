// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { initializeIcons } from '@fluentui/react';
import { CallAgent, Call } from '@azure/communication-calling';
import { StatefulCallClient } from '@internal/calling-stateful-client';
import { CallClientProvider, CallAgentProvider, CallProvider } from '@internal/calling-component-bindings';
import { StatefulComponents } from './statefulComponents';

/**
 * Props to set up calling components.
 * @internal
 */
export type CallComponentsProps = {
  callClient: StatefulCallClient;
  callAgent: CallAgent;
  call: Call;
};

/**
 * return calling components.
 *
 * @internal
 */
export const CallComponents = (props: CallComponentsProps): JSX.Element => {
  initializeIcons();
  const { callClient, callAgent, call } = props;

  return (
    <div>
      {callClient && callAgent && call && (
        <CallClientProvider callClient={callClient}>
          <CallAgentProvider callAgent={callAgent}>
            <CallProvider call={call}>
              <StatefulComponents />
            </CallProvider>
          </CallAgentProvider>
        </CallClientProvider>
      )}
    </div>
  );
};
