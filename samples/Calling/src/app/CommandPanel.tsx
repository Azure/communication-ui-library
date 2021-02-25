// © Microsoft Corporation. All rights reserved.

import {
  fullHeightStyles,
  paneHeaderStyle,
  paneHeaderTextStyle,
  settingsContainerStyle
} from 'app/styles/CommandPanel.styles';

import { Footer } from './Footer';
import { LocalSettings, ParticipantStack } from '@azure/communication-ui';
import React from 'react';
import { Stack } from '@fluentui/react';

export enum CommandPanelTypes {
  None = 'none',
  People = 'People',
  Settings = 'Settings'
}

export interface CommandPanelProps {
  selectedPane: string;
}

export const CommandPanel = (props: CommandPanelProps): JSX.Element => {
  return (
    <Stack styles={fullHeightStyles}>
      <Stack.Item className={paneHeaderStyle}>
        <div className={paneHeaderTextStyle}>{props.selectedPane}</div>
      </Stack.Item>
      {props.selectedPane === CommandPanelTypes.People && (
        <Stack.Item styles={fullHeightStyles}>
          <ParticipantStack />
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
            <LocalSettings />
          </div>
        </Stack.Item>
      )}
    </Stack>
  );
};
