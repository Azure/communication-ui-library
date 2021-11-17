import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  DevicesButton,
  ParticipantsButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';

const componentMainDivStyle = {
  display: 'flex',
  border: 'solid 0.5px lightgray',
  height: '24rem',
  alignItems: 'center',
  justifyContent: 'center'
};

export const ControlBarLayoutExample: () => JSX.Element = () => {
  return (
    <div style={componentMainDivStyle}>
      <FluentThemeProvider>
        <ControlBar layout="floatingLeft">
          <CameraButton />
          <MicrophoneButton />
          <ScreenShareButton />
          <ParticipantsButton participants={[]} />
          <DevicesButton />
          <EndCallButton />
        </ControlBar>
      </FluentThemeProvider>
    </div>
  );
};
