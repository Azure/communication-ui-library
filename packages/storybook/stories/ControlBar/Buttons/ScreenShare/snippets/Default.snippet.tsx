import React from 'react';
import { Stack } from '@fluentui/react';
import { ScreenShareButton } from 'react-components';

export const ScreenShareButtonExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <ScreenShareButton key={'micBtn1'} checked={true} />
      <ScreenShareButton key={'micBtn2'} />
    </Stack>
  );
};
