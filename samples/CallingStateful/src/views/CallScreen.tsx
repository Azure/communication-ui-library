// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IncomingCallStack, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import CallingComponents from '../components/CallingComponents';
import React from 'react';
import { CallCommon, Call, TeamsCall } from '@azure/communication-calling';

export interface CallScreenProps {
  call: CallCommon;
  onSetCall: (call: Call | TeamsCall) => void;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { call } = props;
  const incomingCallStackProps = usePropsFor(IncomingCallStack);
  return (
    <Stack style={{ width: '100%', height: '100%', margin: 'auto', position: 'relative' }}>
      <>{call && <CallingComponents />}</>
      <Stack style={{ position: 'absolute', top: '0', right: '0' }}>
        {<IncomingCallStack {...incomingCallStackProps} tabIndex={1} />}
      </Stack>
    </Stack>
  );
};
