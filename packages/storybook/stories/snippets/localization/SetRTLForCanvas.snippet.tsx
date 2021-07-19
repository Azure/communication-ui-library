import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  ar_SA
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const SetRTLForCanvasSnippet = (): JSX.Element => {
  return (
    <Stack dir="rtl">
      <LocalizationProvider locale={ar_SA}>
        <ControlBar>
          <CameraButton showLabel={true} />
          <MicrophoneButton showLabel={true} />
          <ScreenShareButton showLabel={true} />
          <EndCallButton showLabel={true} />
        </ControlBar>
      </LocalizationProvider>
    </Stack>
  );
};
