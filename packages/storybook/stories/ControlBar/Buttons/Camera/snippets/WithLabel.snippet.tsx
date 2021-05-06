import { CameraButton } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const CameraButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <CameraButton showLabel={true} checked={true} />
    </Stack>
  );
};
