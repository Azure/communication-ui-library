import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  ar_SA
} from '@azure/communication-react';
import { setRTL } from '@fluentui/react';
import React from 'react';

export const SetRTLSnippet = (): JSX.Element => {
  setRTL(true);
  return (
    <LocalizationProvider locale={ar_SA}>
      <ControlBar>
        <CameraButton showLabel={true} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </LocalizationProvider>
  );
};
