// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  COMPONENT_LOCALE_EN_US,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { registerIcons } from '@fluentui/react';

import React from 'react';

registerIcons({
  icons: DEFAULT_COMPONENT_ICONS
});

export const CustomLocale = (): JSX.Element => {
  COMPONENT_LOCALE_EN_US.strings.cameraButton.offLabel = 'Start';
  return (
    <div style={{ width: '100%' }}>
      <LocalizationProvider locale={COMPONENT_LOCALE_EN_US}>
        <ControlBar>
          <CameraButton showLabel={true} />
          <MicrophoneButton showLabel={true} />
          <ScreenShareButton showLabel={true} />
          <EndCallButton showLabel={true} />
        </ControlBar>
      </LocalizationProvider>
    </div>
  );
};
