import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  OptionsButton,
  ParticipantListProps,
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

const mockParticipantsProps: ParticipantListProps = {
  participants: []
};

export const ControlBarLayoutExample: () => JSX.Element = () => {
  return (
    <div style={componentMainDivStyle}>
      <FluentThemeProvider>
        <ControlBar layout="floatingLeft">
          <CameraButton />
          <MicrophoneButton />
          <ScreenShareButton />
          <ParticipantsButton participantListProps={mockParticipantsProps} />
          <OptionsButton />
          <EndCallButton />
        </ControlBar>
      </FluentThemeProvider>
    </div>
  );
};
