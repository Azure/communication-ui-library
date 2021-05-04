import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  OptionsButton,
  ScreenShareButton,
  defaultThemes
} from 'react-components';
import React from 'react';

export const DarkControlBar = (): JSX.Element => {
  return (
    <FluentThemeProvider fluentTheme={defaultThemes.dark.theme}>
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
