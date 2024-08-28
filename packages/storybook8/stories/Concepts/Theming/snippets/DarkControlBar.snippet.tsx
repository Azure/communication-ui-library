import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  DevicesButton,
  ScreenShareButton,
  darkTheme
} from '@azure/communication-react';
import React from 'react';

export const DarkControlBar = (): JSX.Element => {
  return (
    <FluentThemeProvider fluentTheme={darkTheme}>
      <ControlBar>
        <CameraButton />
        <MicrophoneButton />
        <ScreenShareButton />
        <DevicesButton />
        <EndCallButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};
