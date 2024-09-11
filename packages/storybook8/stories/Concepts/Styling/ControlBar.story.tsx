// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  CameraButton,
  ControlBar,
  DEFAULT_COMPONENT_ICONS,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton
} from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React from 'react';

initializeIcons();
registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS } });

// ControlBar component accepts a `styles` prop with only the `root` key as a valid property.
const styles = {
  root: {
    background: 'white',
    border: '2px solid firebrick',
    '& button': {
      ':hover': {
        background: 'black',
        color: 'white'
      }
    }
  }
};
export const ControlBarExample = (): JSX.Element => {
  return (
    <FluentThemeProvider rootStyle={{ height: '60px', width: '100%' }}>
      <ControlBar styles={styles}>
        <CameraButton />
        <MicrophoneButton />
        <EndCallButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};
