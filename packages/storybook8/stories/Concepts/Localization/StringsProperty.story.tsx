// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CameraButton,
  ControlBar,
  DEFAULT_COMPONENT_ICONS,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton
} from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React from 'react';

initializeIcons();
registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS } });

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
