import {
  LocalizationProvider,
  FluentThemeProvider,
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton,
  ar_SA
} from '@azure/communication-react';
import React from 'react';

export const SetRTLSnippet = (): JSX.Element => {
  return (
    <LocalizationProvider locale={ar_SA}>
      <FluentThemeProvider rtl={true}>
        <ControlBar>
          <CameraButton showLabel={true} />
          <MicrophoneButton showLabel={true} />
          <ScreenShareButton showLabel={true} />
          <EndCallButton showLabel={true} />
        </ControlBar>
      </FluentThemeProvider>
    </LocalizationProvider>
  );
};
