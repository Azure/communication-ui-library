import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  COMPONENT_LOCALE_FR_FR
} from '@azure/communication-react';
import React from 'react';

export const LocalizationProviderSnippet = (): JSX.Element => {
  return (
    <LocalizationProvider locale={COMPONENT_LOCALE_FR_FR}>
      <ControlBar>
        <CameraButton showLabel={true} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </LocalizationProvider>
  );
};
