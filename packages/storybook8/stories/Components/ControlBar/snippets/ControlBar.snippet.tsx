import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  DevicesButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';

export const ControlBarExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <CameraButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <MicrophoneButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <ScreenShareButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <DevicesButton menuProps={undefined /*some IContextualMenuProps*/} />
        <EndCallButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
      </ControlBar>
    </FluentThemeProvider>
  );
};
