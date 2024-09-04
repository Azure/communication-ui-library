// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  FluentThemeProvider,
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React from 'react';

initializeIcons();
registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS } });

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
