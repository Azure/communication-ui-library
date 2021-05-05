import React from 'react';
import { Stack } from '@fluentui/react';
import { ScreenShareButton } from 'react-components';

export const ScreenShareButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <ScreenShareButton showLabel={true} checked={true} />
    </Stack>
  );
};
