import React from 'react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  ScreenShareButton
} from '@azure/communication-react';

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
