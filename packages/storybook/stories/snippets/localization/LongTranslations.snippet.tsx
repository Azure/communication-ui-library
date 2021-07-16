import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  de_DE
} from '@azure/communication-react';
import React from 'react';

export const LongTranslationsSnippet = (): JSX.Element => {
  return (
    <LocalizationProvider locale={de_DE}>
      <ControlBar>
        <CameraButton showLabel={true} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </LocalizationProvider>
  );
};
