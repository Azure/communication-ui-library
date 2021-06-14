// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack } from '@fluentui/react';
import {
  fullHeightStyles,
  paneHeaderStyle,
  paneHeaderTextStyle,
  settingsContainerStyle
} from './styles/CommandPanel.styles';
import { ThemeSelector } from './theming/ThemeSelector';
import { useCallingSelector as useSelector, getCallingSelector } from 'calling-component-bindings';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { OptionsButton } from 'react-components';
import { useAzureCommunicationHandlers } from './hooks/useAzureCommunicationHandlers';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';

export enum CommandPanelTypes {
  None = 'none',
  Settings = 'Settings'
}

export interface CommandPanelProps {
  selectedPane: string;
}

export const CommandPanel = (props: CommandPanelProps): JSX.Element => {
  const options = useSelector(getCallingSelector(OptionsButton), { callId: '' });
  const handlers = useAzureCommunicationHandlers();
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  return (
    <Stack styles={fullHeightStyles} tokens={{ childrenGap: '1.5rem' }}>
      <Stack.Item className={paneHeaderStyle}>
        <div className={paneHeaderTextStyle}>{props.selectedPane}</div>
      </Stack.Item>
      {props.selectedPane === CommandPanelTypes.Settings && (
        <Stack.Item>
          <div className={settingsContainerStyle}>
            <LocalDeviceSettings
              {...options}
              cameraPermissionGranted={cameraPermissionGranted}
              microphonePermissionGranted={microphonePermissionGranted}
              onSelectCamera={handlers.onSelectCamera}
              onSelectMicrophone={handlers.onSelectMicrophone}
              onSelectSpeaker={handlers.onSelectSpeaker}
            />
          </div>
        </Stack.Item>
      )}
      {props.selectedPane === CommandPanelTypes.Settings && (
        <Stack.Item>
          <div className={settingsContainerStyle}>
            <ThemeSelector label="Theme" />
          </div>
        </Stack.Item>
      )}
    </Stack>
  );
};
