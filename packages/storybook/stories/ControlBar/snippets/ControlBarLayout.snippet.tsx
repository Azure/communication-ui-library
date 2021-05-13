import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  OptionsButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';

export const ControlBarLayoutExample: () => JSX.Element = () => {
  return (
    <div
      style={{
        display: 'flex',
        border: 'solid 0.5px lightgray',
        height: '350px',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <FluentThemeProvider>
        <ControlBar layout="floatingLeft">
          <CameraButton />
          <MicrophoneButton />
          <ScreenShareButton />
          <OptionsButton />
          <EndCallButton />
        </ControlBar>
      </FluentThemeProvider>
    </div>
  );
};
