import React from 'react';
import { CameraButton } from '@azure/communication-ui';
import { Stack } from '@fluentui/react';

export const CameraButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <CameraButton showLabel={true} checked={true} />
    </Stack>
  );
};
