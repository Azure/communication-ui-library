import React from 'react';
import { Stack } from '@fluentui/react';
import { CameraButton } from 'react-components';

export const CameraButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <CameraButton showLabel={true} checked={true} />
    </Stack>
  );
};
