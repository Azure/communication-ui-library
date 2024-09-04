// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider as LocaleProvider,
  MicrophoneButton,
  ScreenShareButton,
  COMPONENT_LOCALE_FR_FR,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React from 'react';

initializeIcons();
registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS } });

export const LocalizationProvider = (): JSX.Element => {
  return (
    <div style={{ width: '100%' }}>
      <LocaleProvider locale={COMPONENT_LOCALE_FR_FR}>
        <ControlBar>
          <CameraButton showLabel={true} />
          <MicrophoneButton showLabel={true} />
          <ScreenShareButton showLabel={true} />
          <EndCallButton showLabel={true} />
        </ControlBar>
      </LocaleProvider>
    </div>
  );
};
