import React from 'react';
import { Stack } from '@fluentui/react';
import { MicrophoneButton } from 'react-components';

export const MicrophoneButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <MicrophoneButton showLabel={true} checked={true} />
    </Stack>
  );
};
