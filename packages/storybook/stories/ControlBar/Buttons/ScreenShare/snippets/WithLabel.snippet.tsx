import { ScreenShareButton } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const ScreenShareButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <ScreenShareButton showLabel={true} checked={true} />
    </Stack>
  );
};
