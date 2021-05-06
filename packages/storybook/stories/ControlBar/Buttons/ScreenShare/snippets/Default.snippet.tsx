import { ScreenShareButton } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const ScreenShareButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <ScreenShareButton key={'micBtn1'} checked={true} />
      <ScreenShareButton key={'micBtn2'} />
    </Stack>
  );
};
