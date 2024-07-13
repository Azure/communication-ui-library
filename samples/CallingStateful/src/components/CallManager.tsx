// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call, TeamsCall } from '@azure/communication-calling';
import { IStackStyles, PrimaryButton, Stack, Text, Theme, useTheme } from '@fluentui/react';
import React, { useEffect, useState } from 'react';

export interface CallManagerProps {
  onSetActiveCall: (call: Call | TeamsCall) => void;
  calls: Call[] | TeamsCall[];
  activeCall?: Call | TeamsCall;
  onSetCallHoldState: (call: Call | TeamsCall) => void;
  onEndCall: (call: Call | TeamsCall) => void;
}

export const CallManager = (props: CallManagerProps): JSX.Element => {
  const { onSetActiveCall, calls, onSetCallHoldState, activeCall } = props;
  const theme = useTheme();
  return (
    <Stack verticalAlign={'start'} styles={callManagerContainerStyle(theme)}>
      <Text variant="xLarge">Active Calls</Text>
      <Stack>
        {activeCall && (
          <CallItem
            call={activeCall}
            onSetActiveCall={onSetActiveCall}
            isActiveCall={true}
            onSetCallHoldState={onSetCallHoldState}
          />
        )}
        {calls.map((call) => (
          <CallItem
            key={call.id}
            call={call}
            onSetActiveCall={onSetActiveCall}
            isActiveCall={call.id === activeCall?.id}
            onSetCallHoldState={onSetCallHoldState}
          />
        ))}
      </Stack>
    </Stack>
  );
};

interface CallItemProps {
  call: Call | TeamsCall;
  isActiveCall: boolean;
  onSetActiveCall: (call: Call | TeamsCall) => void;
  onSetCallHoldState: (call: Call | TeamsCall) => void;
}

const CallItem = (props: CallItemProps): JSX.Element => {
  const { call, onSetActiveCall, onSetCallHoldState } = props;

  const [callTitle, setCallTitle] = useState<string>('');

  useEffect(() => {
    if (call.state === 'Connecting') {
      setCallTitle('Connecting');
    } else {
      const names = call.remoteParticipants.map((participant) => participant.displayName);
      if (names.length === 1 && names[0]) {
        setCallTitle(names[0]);
      } else if (names.length > 1) {
        setCallTitle(names.join(', '));
      } else if (names.length === 0) {
        setCallTitle('Unknown');
      }
    }
  }, [call.state, call.remoteParticipants]);

  return (
    <Stack tokens={{ childrenGap: '0.5rem' }} style={{ padding: '0.2rem' }}>
      <Stack horizontal tokens={{ childrenGap: '0.7rem' }}>
        {callTitle && <Text>{callTitle}</Text>}
        {call.state ? <Text>{call.state}</Text> : null}
      </Stack>
      <Stack horizontal tokens={{ childrenGap: '1rem' }}>
        <PrimaryButton onClick={() => onSetActiveCall(call)}>Resume</PrimaryButton>
        <PrimaryButton onClick={() => onSetCallHoldState(call)}>Hold</PrimaryButton>
      </Stack>
    </Stack>
  );
};

const callManagerContainerStyle = (theme: Theme): IStackStyles => {
  return {
    root: {
      minHeight: '5rem',
      overflowY: 'auto',
      height: '100%',
      padding: '0.5rem',
      maxHeight: '30rem',
      border: `1px solid ${theme.palette.neutralLight}`,
      borderRadius: '0.5rem',
      boxShadow: theme.effects.elevation8
    }
  };
};
