import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  OptionsButton,
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
        <OptionsButton />
        <EndCallButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};
