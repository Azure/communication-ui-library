// © Microsoft Corporation. All rights reserved.

import React from 'react';
import {
  ControlBar,
  MicrophoneButton,
  CameraButton,
  ScreenShareButton,
  HangupButtonComponent
} from '@azure/communication-ui';

export const CallControls = (): JSX.Element => {
  return (
    <ControlBar>
      <MicrophoneButton />
      <CameraButton />
      <ScreenShareButton />
      <HangupButtonComponent />
    </ControlBar>
  );
};
