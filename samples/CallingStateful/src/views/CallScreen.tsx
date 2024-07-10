import {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  DeclarativeCallAgent,
  DeclarativeTeamsCallAgent,
  StatefulCallClient
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import CallingComponents from '../components/CallingComponents';
import React from 'react';
import { CallCommon, Call, TeamsCall } from '@azure/communication-calling';

export interface CallScreenProps {
  call: CallCommon;
  callAgent: DeclarativeCallAgent | DeclarativeTeamsCallAgent;
  statefulCallClient: StatefulCallClient;
  onSetCall: (call: CallCommon) => void;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { call, callAgent, statefulCallClient } = props;
  return (
    <Stack style={{ width: '100%', height: '100%', margin: 'auto', position: 'relative' }}>
      <CallClientProvider callClient={statefulCallClient}>
        {callAgent && (
          <CallAgentProvider callAgent={callAgent}>
            {call && (
              <CallProvider call={call.kind === 'Call' ? (call as Call) : (call as TeamsCall)}>
                <CallingComponents></CallingComponents>
              </CallProvider>
            )}
          </CallAgentProvider>
        )}
      </CallClientProvider>
    </Stack>
  );
};
