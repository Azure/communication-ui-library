import React from 'react';
import { Stack } from '@fluentui/react';
import { MicrophoneButton } from '@azure/communication-react';

export const MicrophoneButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <MicrophoneButton showLabel={true} checked={true} />
    </Stack>
  );
};
