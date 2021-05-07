import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  OptionsButton,
  ScreenShareButton
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

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
