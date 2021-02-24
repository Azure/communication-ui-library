// © Microsoft Corporation. All rights reserved.

import {
  fullHeightStyles,
  paneHeaderStyle,
  paneHeaderTextStyle,
  settingsContainerStyle
} from './styles/CommandPanel.styles';

import Footer from '../composites/GroupCall/Footer';
import LocalSettings from './LocalSettings';
import { ParticipantStack } from '../components';
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

export default (props: CommandPanelProps): JSX.Element => {
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
