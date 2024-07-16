// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientProvider, StatefulCallClient } from '@azure/communication-react';
/* @conditional-compile-remove(one-to-n-calling) */
import {
  DeclarativeCallAgent,
  DeclarativeTeamsCallAgent,
  CallAgentProvider,
  CallProvider
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(one-to-n-calling) */
import CallingComponents from '../components/CallingComponents';
import React from 'react';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallCommon, Call, TeamsCall } from '@azure/communication-calling';

export interface CallScreenProps {
  /* @conditional-compile-remove(one-to-n-calling) */
  call: CallCommon;
  /* @conditional-compile-remove(one-to-n-calling) */
  callAgent: DeclarativeCallAgent | DeclarativeTeamsCallAgent;
  statefulCallClient: StatefulCallClient;
  /* @conditional-compile-remove(one-to-n-calling) */
  onSetCall: (call: CallCommon) => void;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const {
    /* @conditional-compile-remove(one-to-n-calling) */ call,
    /* @conditional-compile-remove(one-to-n-calling) */ callAgent,
    statefulCallClient
  } = props;
  return (
    <Stack style={{ width: '100%', height: '100%', margin: 'auto', position: 'relative' }}>
      <CallClientProvider callClient={statefulCallClient}>
        <>
          {
            /* @conditional-compile-remove(one-to-n-calling) */ callAgent && (
              <CallAgentProvider callAgent={callAgent}>
                {call && (
                  <CallProvider call={call.kind === 'Call' ? (call as Call) : (call as TeamsCall)}>
                    <CallingComponents></CallingComponents>
                  </CallProvider>
                )}
              </CallAgentProvider>
            )
          }
        </>
      </CallClientProvider>
    </Stack>
  );
};
