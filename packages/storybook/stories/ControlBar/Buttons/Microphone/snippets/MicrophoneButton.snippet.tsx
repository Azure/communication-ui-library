import React from 'react';
import { Stack } from '@fluentui/react';
import { MicrophoneButton } from '@azure/communication-react';

export const MicrophoneButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <MicrophoneButton key={'micBtn1'} checked={true} />
      <MicrophoneButton key={'micBtn2'} />
    </Stack>
  );
};
