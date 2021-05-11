import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';

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
