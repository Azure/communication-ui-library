import { MicrophoneButton } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const MicrophoneButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <MicrophoneButton key={'micBtn1'} checked={true} />
      <MicrophoneButton key={'micBtn2'} />
    </Stack>
  );
};
