import React from 'react';
import { Stack } from '@fluentui/react';
import { CameraButton } from '@azure/communication-react';

export const CameraButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <CameraButton showLabel={true} checked={true} />
    </Stack>
  );
};
