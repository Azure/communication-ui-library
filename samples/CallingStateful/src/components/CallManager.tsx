// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallCommon } from '@azure/communication-calling';
import { PrimaryButton, Stack, Text } from '@fluentui/react';
import React from 'react';

export interface CallManagerProps {
  onSetActiveCall: (call: CallCommon) => void;
  calls: CallCommon[];
  activeCall?: CallCommon;
  onSetCallHoldState: (call: CallCommon) => void;
  onEndCall: (call: CallCommon) => void;
}

export const CallManager = (props: CallManagerProps): JSX.Element => {
  const { onSetActiveCall, calls, onSetCallHoldState, activeCall } = props;

  return (
    <Stack>
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
  );
};

interface CallItemProps {
  call: CallCommon;
  isActiveCall: boolean;
  onSetActiveCall: (call: CallCommon) => void;
  onSetCallHoldState: (call: CallCommon) => void;
}

const CallItem = (props: CallItemProps): JSX.Element => {
  const { call, onSetActiveCall, onSetCallHoldState } = props;

  return (
    <Stack tokens={{ childrenGap: '0.5rem' }}>
      <Stack horizontal tokens={{ childrenGap: '0.7rem' }}>
        <Text>{call.callerInfo.displayName}</Text>
        {call.state === 'LocalHold' ? <Text>On Hold</Text> : null}
      </Stack>
      <Stack horizontal tokens={{ childrenGap: '1rem' }}>
        <PrimaryButton onClick={() => onSetActiveCall(call)}>Resume</PrimaryButton>
        <PrimaryButton onClick={() => onSetCallHoldState(call)}>Hold</PrimaryButton>
      </Stack>
    </Stack>
  );
};
