// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  FluentThemeProvider,
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';

export const SetRTL = (): JSX.Element => {
  return (
    <div style={{ width: '100%' }}>
      <FluentThemeProvider rtl={true}>
        <ControlBar>
          <CameraButton showLabel={true} />
          <MicrophoneButton showLabel={true} />
          <ScreenShareButton showLabel={true} />
          <EndCallButton showLabel={true} />
        </ControlBar>
      </FluentThemeProvider>
    </div>
  );
};
