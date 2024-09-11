// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(one-to-n-calling) */
import { IncomingCallStack, usePropsFor } from '@azure/communication-react';
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
  onSetCall: (call: Call | TeamsCall) => void;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { /* @conditional-compile-remove(one-to-n-calling) */ call } = props;
  /* @conditional-compile-remove(one-to-n-calling) */
  const incomingCallStackProps = usePropsFor(IncomingCallStack);
  return (
    <Stack style={{ width: '100%', height: '100%', margin: 'auto', position: 'relative' }}>
      <>{/* @conditional-compile-remove(one-to-n-calling) */ call && <CallingComponents />}</>
      <Stack style={{ position: 'absolute', top: '0', right: '0' }}>
        {
          /* @conditional-compile-remove(one-to-n-calling) */ <IncomingCallStack
            {...incomingCallStackProps}
            tabIndex={1}
          />
        }
      </Stack>
    </Stack>
  );
};
