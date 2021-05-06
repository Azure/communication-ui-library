import React from 'react';
import { Stack } from '@fluentui/react';
import { ScreenShareButton } from '@azure/communication-react';

export const ScreenShareButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <ScreenShareButton key={'micBtn1'} checked={true} />
      <ScreenShareButton key={'micBtn2'} />
    </Stack>
  );
};
