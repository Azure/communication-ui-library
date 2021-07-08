import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  en_GB
} from '@azure/communication-react';
import React from 'react';

export const StringsPropertySnippet = (): JSX.Element => {
  return (
    <LocalizationProvider locale={en_GB}>
      <ControlBar>
        <CameraButton showLabel={true} strings={{ offLabel: 'Start' }} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </LocalizationProvider>
  );
};
