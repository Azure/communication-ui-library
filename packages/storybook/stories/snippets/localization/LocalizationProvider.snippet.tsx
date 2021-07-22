import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  fr_FR
} from '@azure/communication-react';
import React from 'react';

export const LocalizationProviderSnippet = (): JSX.Element => {
  return (
    <LocalizationProvider locale={fr_FR}>
      <ControlBar>
        <CameraButton showLabel={true} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </LocalizationProvider>
  );
};
