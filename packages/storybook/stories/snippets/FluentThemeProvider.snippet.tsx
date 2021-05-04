import React from 'react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  ScreenShareButton
} from 'react-components';

export const FluentThemeProviderSnippet = (): JSX.Element => {
  return (
    <FluentThemeProvider>
      <ControlBar>
        <CameraButton />
        <MicrophoneButton />
        <ScreenShareButton />
        <EndCallButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};
