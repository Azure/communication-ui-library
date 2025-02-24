// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call, TeamsCall } from '@azure/communication-calling';
import { IStackStyles, PrimaryButton, Stack, Text, Theme, useTheme } from '@fluentui/react';
import React, { useEffect, useState } from 'react';

export interface CallManagerProps {
  onSetResume: (call: Call | TeamsCall) => void;
  calls: Call[] | TeamsCall[];
  activeCall?: Call | TeamsCall;
  onSetHold: (call: Call | TeamsCall) => void;
  onEndCall: (call: Call | TeamsCall) => void;
}

export const CallManager = (props: CallManagerProps): JSX.Element => {
  const { onSetResume, calls, onSetHold, activeCall } = props;
  const theme = useTheme();

  const [otherCalls, setOtherCalls] = useState<Call[] | TeamsCall[]>([]);

  /**
   * We want to make sure that we are still tracking either Calls or TeamsCalls since the two call types cannot be in
   * the same array here. Filter is combining the types in the return so we need to make sure that we are only filtering
   * against one type of call to stop TypeScript from complaining.
   */
  useEffect(() => {
    if (calls[0] && calls[0].kind === 'TeamsCall') {
      setOtherCalls((calls as TeamsCall[]).filter((call: TeamsCall) => call.id !== activeCall?.id));
    } else {
      setOtherCalls((calls as Call[]).filter((call: Call) => call.id !== activeCall?.id));
    }
  }, [calls, activeCall]);

  return (
    <Stack verticalAlign={'start'} styles={callManagerContainerStyle(theme)}>
      <Text variant="xLarge">Calls</Text>
      <Stack>
        {activeCall && (
          <Stack>
            <Text variant="large">Active Call</Text>
            <CallItem call={activeCall} onSetResume={onSetResume} isActiveCall={true} onSetHold={onSetHold} />
          </Stack>
        )}
        {
          <Stack>
            {otherCalls && otherCalls.length > 1 && <Text variant="large">Other Calls</Text>}
            {otherCalls.map((call) => {
              if (call.id === activeCall?.id) {
                return;
              }
              return (
                <CallItem
                  key={call.id}
                  call={call}
                  onSetResume={onSetResume}
                  isActiveCall={call.id === activeCall?.id}
                  onSetHold={onSetHold}
                />
              );
            })}
          </Stack>
        }
      </Stack>
    </Stack>
  );
};

interface CallItemProps {
  call: Call | TeamsCall;
  isActiveCall: boolean;
  onSetResume: (call: Call | TeamsCall) => void;
  onSetHold: (call: Call | TeamsCall) => void;
}

const CallItem = (props: CallItemProps): JSX.Element => {
  const { call, onSetResume, onSetHold } = props;

  const [callTitle, setCallTitle] = useState<string>('');

  useEffect(() => {
    if (call.state === 'Connecting') {
      setCallTitle('');
    } else {
      const names = call.remoteParticipants.map((participant) => participant.displayName);
      if (names.length === 1 && names[0]) {
        setCallTitle(names[0]);
      } else if (names.length > 1) {
        setCallTitle(names.join(', '));
      } else {
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
        <PrimaryButton onClick={() => onSetResume(call)}>Resume</PrimaryButton>
        <PrimaryButton onClick={() => onSetHold(call)}>Hold</PrimaryButton>
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
