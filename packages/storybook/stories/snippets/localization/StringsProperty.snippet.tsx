import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';

export const StringsPropertySnippet = (): JSX.Element => {
  return (
    <ControlBar>
      <CameraButton showLabel={true} strings={{ offLabel: 'Start' }} />
      <MicrophoneButton showLabel={true} />
      <ScreenShareButton showLabel={true} />
      <EndCallButton showLabel={true} />
    </ControlBar>
  );
};
