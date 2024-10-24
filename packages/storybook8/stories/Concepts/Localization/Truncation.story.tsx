// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  COMPONENT_LOCALE_DE_DE,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { initializeIcons, IStyle, registerIcons } from '@fluentui/react';
import React from 'react';

initializeIcons();
registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS } });

export const Truncation = (): JSX.Element => {
  const buttonStyle = {
    root: { width: '4rem', padding: '0' },
    label: {
      width: '2.75rem',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      margin: '0 auto'
    } as IStyle
  };
  return (
    <div style={{ width: '100%' }}>
      <LocalizationProvider locale={COMPONENT_LOCALE_DE_DE}>
        <ControlBar>
          <CameraButton showLabel={true} styles={buttonStyle} />
          <MicrophoneButton showLabel={true} styles={buttonStyle} />
          <ScreenShareButton showLabel={true} styles={buttonStyle} />
          <EndCallButton showLabel={true} styles={buttonStyle} />
        </ControlBar>
      </LocalizationProvider>
    </div>
  );
};
