import { CameraButton } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const CameraButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <CameraButton key={'camBtn1'} checked={true} />
      <CameraButton key={'camBtn2'} />
    </Stack>
  );
};
