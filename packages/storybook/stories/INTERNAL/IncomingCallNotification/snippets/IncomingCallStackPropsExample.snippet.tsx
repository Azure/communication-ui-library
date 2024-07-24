import { CallCommon } from '@azure/communication-calling';
import { IncomingCallStack, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';
// import { CallingComponents } from './CallingComponents';

interface CallScreenProps {
  call: CallCommon;
}

/**
 * Your main call screen page.
 */
export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { call } = props;
  /**
   * The usage of `usePropsFor` is to get the props for the `IncomingCallStack` component.
   */
  const incomingCallStackProps = usePropsFor(IncomingCallStack);
  return (
    <Stack style={{ width: '100%', height: '100%', margin: 'auto', position: 'relative' }}>
      <>{call && <CallingComponents />}</>
      <Stack style={{ position: 'absolute', top: '0', right: '0' }}>
        <IncomingCallStack {...incomingCallStackProps} />
      </Stack>
    </Stack>
  );
};
