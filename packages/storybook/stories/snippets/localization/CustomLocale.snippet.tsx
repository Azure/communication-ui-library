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

export const CustomLocaleSnippet = (): JSX.Element => {
  en_GB.strings.cameraButton.offLabel = 'Start';
  return (
    <LocalizationProvider locale={en_GB}>
      <ControlBar>
        <CameraButton showLabel={true} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </LocalizationProvider>
  );
};
