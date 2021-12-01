import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';

export const DefaultThemeSnippet = (): JSX.Element => {
  return (
    <ControlBar>
      <CameraButton />
      <MicrophoneButton />
      <ScreenShareButton />
      <EndCallButton />
    </ControlBar>
  );
};
