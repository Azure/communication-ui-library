// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { GroupLocator, MeetingLocator } from '@azure/communication-calling';
import { CallConfiguration } from './CallConfiguration';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { useCallingSelector as useSelector, getCallingSelector } from 'calling-component-bindings';
import { useAzureCommunicationHandlers } from './hooks/useAzureCommunicationHandlers';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';
import { OptionsButton } from 'react-components';
import { containerGapStyle, titleContainerStyle } from './styles/ConfiguratonScreen.styles';
import { PrimaryButton } from '@fluentui/react';

export interface ConfigurationScreenProps {
  startCallHandler: (data?: { callLocator: GroupLocator | MeetingLocator }) => void;
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (isEnabled: boolean) => void;
  callType: 'newCall' | 'joinCall' | 'teamsCall';
}

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler, callType } = props;

  const options = useSelector(getCallingSelector(OptionsButton));
  const handlers = useAzureCommunicationHandlers();
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  const startOrJoinText =
    callType === 'newCall'
      ? 'Start call'
      : callType === 'joinCall'
      ? 'Join Call'
      : callType === 'teamsCall'
      ? 'Join Teams Call'
      : 'Start or join call';

  return (
    <CallConfiguration {...props}>
      <div className={titleContainerStyle}>{startOrJoinText}</div>
      <div style={containerGapStyle}>
        <LocalDeviceSettings
          {...options}
          cameraPermissionGranted={cameraPermissionGranted}
          microphonePermissionGranted={microphonePermissionGranted}
          onSelectCamera={handlers.onSelectCamera}
          onSelectMicrophone={handlers.onSelectMicrophone}
          onSelectSpeaker={handlers.onSelectSpeaker}
        />
      </div>
      <div>
        <PrimaryButton onClick={() => startCallHandler} disabled={!microphonePermissionGranted}>
          {startOrJoinText}
        </PrimaryButton>
      </div>
    </CallConfiguration>
  );
};
