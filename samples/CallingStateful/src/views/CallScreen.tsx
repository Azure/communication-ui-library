// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(one-to-n-calling) */
import { CallAdapter, CallComposite, IncomingCallStack, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(one-to-n-calling) */
import CallingComponents from '../components/CallingComponents';
import React from 'react';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallCommon, Call, TeamsCall } from '@azure/communication-calling';

export interface CallScreenProps {
  adapter: CallAdapter;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { /* @conditional-compile-remove(one-to-n-calling) */ adapter } = props;
  const incomingCallStackProps = usePropsFor(IncomingCallStack);
  return (
    <Stack style={{ width: '100%', height: '100%', margin: 'auto', position: 'relative' }}>
      {adapter && <CallComposite adapter={adapter} />}
      <Stack style={{ position: 'absolute', top: '0', right: '0', zIndex: 100 }}>
        <IncomingCallStack {...incomingCallStackProps} />
      </Stack>
    </Stack>
  );
};
