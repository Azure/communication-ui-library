// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton,
  DevicesButton,
  ScreenShareButton,
  darkTheme,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { registerIcons } from '@fluentui/react';

import React from 'react';

registerIcons({
  icons: DEFAULT_COMPONENT_ICONS
});

export const DarkControlBar = (): JSX.Element => {
  return (
    <FluentThemeProvider fluentTheme={darkTheme} rootStyle={{ height: '56px', width: '280px' }}>
      <ControlBar>
        <CameraButton />
        <MicrophoneButton />
        <ScreenShareButton />
        <DevicesButton />
        <EndCallButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};
