// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { optionsButtonSelector, participantListSelector } from '@azure/acs-calling-selector';
import { Stack, IContextualMenuItem } from '@fluentui/react';
import {
  fullHeightStyles,
  paneHeaderStyle,
  paneHeaderTextStyle,
  settingsContainerStyle
} from 'app/styles/CommandPanel.styles';
import { ThemeSelector } from 'app/theming/ThemeSelector';
import { useCall, useCallingContext } from 'react-composites';
import { Footer } from './Footer';
import { useHandlers } from './hooks/useHandlers';
import { useSelector } from './hooks/useSelector';
import { LocalDeviceSettingsComponent } from './LocalDeviceSettings';
import { ParticipantList, WebUIParticipant } from 'react-components';

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

  const onRenderParticipantMenu = (participant: WebUIParticipant): IContextualMenuItem[] => {
    const menuItems: IContextualMenuItem[] = [];
    if (participant.userId !== participantListProps.myUserId) {
      menuItems.push({
        key: 'Remove',
        text: 'Remove',
        onClick: () => {
          call?.removeParticipant({ communicationUserId: participant.userId });
        }
      });
    }
    return menuItems;
  };
  const options = useSelector(optionsButtonSelector, { callId: '' });
  const handlers = useHandlers(LocalDeviceSettingsComponent);
  const { videoDeviceInfo } = useCallingContext();

  return (
    <Stack styles={fullHeightStyles} tokens={{ childrenGap: '1.5rem' }}>
      <Stack.Item className={paneHeaderStyle}>
        <div className={paneHeaderTextStyle}>{props.selectedPane}</div>
      </Stack.Item>
      {props.selectedPane === CommandPanelTypes.People && (
        <Stack.Item styles={fullHeightStyles}>
          <ParticipantList {...participantListProps} onRenderParticipantMenu={onRenderParticipantMenu} />
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
            <LocalDeviceSettingsComponent
              {...options}
              selectedCamera={videoDeviceInfo}
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
