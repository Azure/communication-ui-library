import React from 'react';
import { CameraButton } from '@azure/communication-ui';
import { Stack } from '@fluentui/react';

export const CameraButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <CameraButton key={'micBtn1'} checked={true} />
      <CameraButton key={'micBtn2'} />
    </Stack>
  );
};
