import { IncomingCallStack, usePropsFor } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';
/**
 * Your calling components including your video gallery and control bar
 */
import { CallingComponents } from './CallingComponents';

/**
 * Your main call screen page.
 */
export const CallScreen = (): JSX.Element => {
  /**
   * The usage of `usePropsFor` is to get the props for the `IncomingCallStack` component.
   */
  const incomingCallStackProps = usePropsFor(IncomingCallStack);
  return (
    <Stack style={{ margin: 'auto', position: 'relative' }}>
      <CallingComponents />
      <Stack style={{ position: 'absolute', top: '0', right: '0' }}>
        <IncomingCallStack {...incomingCallStackProps} />
      </Stack>
    </Stack>
  );
};
