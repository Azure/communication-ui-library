import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  COMPONENTS_LOCALE_DE_DE
} from '@azure/communication-react';
import React from 'react';

export const LongTranslationsSnippet = (): JSX.Element => {
  return (
    <LocalizationProvider locale={COMPONENTS_LOCALE_DE_DE}>
      <ControlBar>
        <CameraButton showLabel={true} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </LocalizationProvider>
  );
};
