import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  en_US
} from '@azure/communication-react';
import React from 'react';

export const CustomLocaleSnippet = (): JSX.Element => {
  en_US.strings.cameraButton.offLabel = 'Start';
  return (
    <LocalizationProvider locale={en_US}>
      <ControlBar>
        <CameraButton showLabel={true} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </LocalizationProvider>
  );
};
