// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { optionsButtonSelector, participantListSelector } from '@azure/acs-calling-selector';
import { Stack } from '@fluentui/react';
import {
  fullHeightStyles,
  paneHeaderStyle,
  paneHeaderTextStyle,
  settingsContainerStyle
} from 'app/styles/CommandPanel.styles';
import { ThemeSelector } from 'app/theming/ThemeSelector';
import { Footer } from './Footer';
import { useCallingSelector as useSelector } from '@azure/acs-calling-selector';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { ParticipantList } from 'react-components';
import { useAzureCommunicationHandlers } from './hooks/useAzureCommunicationHandlers';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';

export enum CommandPanelTypes {
  None = 'none',
  People = 'People',
  Settings = 'Settings'
}

export interface CommandPanelProps {
  selectedPane: string;
}

export const CommandPanel = (props: CommandPanelProps): JSX.Element => {
  const participantListProps = useSelector(participantListSelector);

  const options = useSelector(optionsButtonSelector, { callId: '' });
  const handlers = useAzureCommunicationHandlers();
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  return (
    <Stack styles={fullHeightStyles} tokens={{ childrenGap: '1.5rem' }}>
      <Stack.Item className={paneHeaderStyle}>
        <div className={paneHeaderTextStyle}>{props.selectedPane}</div>
      </Stack.Item>
      {props.selectedPane === CommandPanelTypes.People && (
        <Stack.Item styles={fullHeightStyles}>
          <ParticipantList {...participantListProps} onParticipantRemove={handlers.onParticipantRemove} />
        </Stack.Item>
      )}
      {props.selectedPane === CommandPanelTypes.People && (
        <Stack.Item>
          <Footer />
        </Stack.Item>
      )}
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
