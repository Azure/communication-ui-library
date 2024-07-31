import {
  FluentThemeProvider,
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';

export const SetRTLSnippet = (): JSX.Element => {
  return (
    <FluentThemeProvider rtl={true}>
      <ControlBar>
        <CameraButton showLabel={true} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </FluentThemeProvider>
  );
};
