import { MicrophoneButton } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const MicrophoneButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <MicrophoneButton showLabel={true} checked={true} />
    </Stack>
  );
};
