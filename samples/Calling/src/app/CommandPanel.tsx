// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Stack } from '@fluentui/react';
import {
  fullHeightStyles,
  paneHeaderStyle,
  paneHeaderTextStyle,
  settingsContainerStyle
} from 'app/styles/CommandPanel.styles';
import { Footer } from './Footer';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { ParticipantList } from './ParticipantList';
import { ThemeSelector } from 'react-components';
import { participantListSelector } from '@azure/acs-calling-selector';
import { useSelector } from './hooks/useSelector';
import { useCall } from 'react-composites';

export enum CommandPanelTypes {
  None = 'none',
  People = 'People',
  Settings = 'Settings'
}

export interface CommandPanelProps {
  selectedPane: string;
}

export const CommandPanel = (props: CommandPanelProps): JSX.Element => {
  const call = useCall();
  const participantListProps = useSelector(participantListSelector, { callId: call ? call.id : '' });

  return (
    <Stack styles={fullHeightStyles} tokens={{ childrenGap: '1.5rem' }}>
      <Stack.Item className={paneHeaderStyle}>
        <div className={paneHeaderTextStyle}>{props.selectedPane}</div>
      </Stack.Item>
      {props.selectedPane === CommandPanelTypes.People && (
        <Stack.Item styles={fullHeightStyles}>
          <ParticipantList {...participantListProps} />
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
            <LocalDeviceSettings />
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
