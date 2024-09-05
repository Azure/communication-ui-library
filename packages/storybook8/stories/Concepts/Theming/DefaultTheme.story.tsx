// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { registerIcons } from '@fluentui/react';

import React from 'react';

registerIcons({
  icons: DEFAULT_COMPONENT_ICONS
});

export const DefaultTheme = (): JSX.Element => {
  return (
    <div style={{ height: '56px', width: '280px' }}>
      <ControlBar>
        <CameraButton />
        <MicrophoneButton />
        <ScreenShareButton />
        <EndCallButton />
      </ControlBar>
    </div>
  );
};
