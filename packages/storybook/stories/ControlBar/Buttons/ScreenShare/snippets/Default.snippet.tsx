import React from 'react';
import { ScreenShareButton } from '@azure/communication-ui';
import { Stack } from '@fluentui/react';

export const ScreenShareButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <ScreenShareButton key={'micBtn1'} checked={true} />
      <ScreenShareButton key={'micBtn2'} />
    </Stack>
  );
};
