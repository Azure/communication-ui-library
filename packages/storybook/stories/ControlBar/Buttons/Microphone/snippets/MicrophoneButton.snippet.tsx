import React from 'react';
import { MicrophoneButton } from '@azure/communication-ui';
import { Stack } from '@fluentui/react';

export const MicrophoneButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <MicrophoneButton key={'micBtn1'} checked={true} />
      <MicrophoneButton key={'micBtn2'} />
    </Stack>
  );
};
