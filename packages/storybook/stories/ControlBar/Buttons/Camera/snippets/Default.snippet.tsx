import React from 'react';
import { Stack } from '@fluentui/react';
import { CameraButton } from '@azure/communication-react';

export const CameraButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <CameraButton key={'micBtn1'} checked={true} />
      <CameraButton key={'micBtn2'} />
    </Stack>
  );
};
