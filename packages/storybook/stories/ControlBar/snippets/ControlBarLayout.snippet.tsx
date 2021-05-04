import React from 'react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  OptionsButton,
  ScreenShareButton
} from '@azure/react-components';
import { Stack } from '@fluentui/react';

export const ControlBarLayoutExample: () => JSX.Element = () => {
  return (
    <Stack style={{ flexFlow: 'row', minHeight: '250px' }}>
      <FluentThemeProvider>
        <ControlBar layout="floatingLeft">
          <CameraButton />
          <MicrophoneButton />
          <ScreenShareButton />
          <OptionsButton />
          <EndCallButton />
        </ControlBar>
      </FluentThemeProvider>
    </Stack>
  );
};
