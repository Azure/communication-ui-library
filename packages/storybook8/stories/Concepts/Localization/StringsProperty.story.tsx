// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton
} from '@azure/communication-react';
import React from 'react';

export const StringsProperty = (): JSX.Element => {
  return (
    <div style={{ width: '100%' }}>
      <ControlBar>
        <CameraButton showLabel={true} strings={{ offLabel: 'Start' }} />
        <MicrophoneButton showLabel={true} />
        <ScreenShareButton showLabel={true} />
        <EndCallButton showLabel={true} />
      </ControlBar>
    </div>
  );
};
