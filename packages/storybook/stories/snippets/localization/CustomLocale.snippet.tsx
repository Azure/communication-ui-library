import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  COMPONENTS_LOCALE_EN_US
} from '@azure/communication-react';
import React from 'react';

export const CustomLocaleSnippet = (): JSX.Element => {
  COMPONENTS_LOCALE_EN_US.strings.cameraButton.offLabel = 'Start';
  return (
    <LocalizationProvider locale={COMPONENTS_LOCALE_EN_US}>
      <ControlBar>
        <CameraButton showLabel={true} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </LocalizationProvider>
  );
};
