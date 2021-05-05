// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Stack } from '@fluentui/react';
import {
  fullHeightStyles,
  paneHeaderStyle,
  paneHeaderTextStyle,
  settingsContainerStyle
} from 'app/styles/CommandPanel.styles';
import { VideoDeviceInfo, LocalVideoStream } from '@azure/communication-calling';
import { Footer } from './Footer';
import { LocalDeviceSettingsComponent } from './LocalDeviceSettings';
import { ParticipantStack } from './ParticipantStack';
import { ThemeSelector, useCallContext, useCallingContext } from '@azure/communication-ui';
import { useSelector } from './hooks/useSelector';
import { optionsButtonSelector } from '@azure/acs-calling-selector';
import { useHandlers } from './hooks/useHandlers';

export enum CommandPanelTypes {
  None = 'none',
  People = 'People',
  Settings = 'Settings'
}

export interface CommandPanelProps {
  selectedPane: string;
}

export const CommandPanel = (props: CommandPanelProps): JSX.Element => {
  const options = useSelector(optionsButtonSelector, { callId: '' });
  const handlers = useHandlers(LocalDeviceSettingsComponent);
  const { setVideoDeviceInfo, videoDeviceInfo } = useCallingContext();
  const { setLocalVideoStream } = useCallContext();

  const onSelectCamera = async (device: VideoDeviceInfo): Promise<void> => {
    setVideoDeviceInfo(device);
    const newLocalVideoStream = new LocalVideoStream(device);
    setLocalVideoStream(newLocalVideoStream);
    await handlers.onSelectCamera(device);
  };

  return (
    <Stack styles={fullHeightStyles} tokens={{ childrenGap: '1.5rem' }}>
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
            <LocalDeviceSettingsComponent
              {...options}
              selectedCamera={videoDeviceInfo}
              onSelectCamera={onSelectCamera}
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
