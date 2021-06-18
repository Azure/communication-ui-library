// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CallConfiguration } from './CallConfiguration';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { useCallingSelector as useSelector, getCallingSelector } from 'calling-component-bindings';
import { useAzureCommunicationHandlers } from './hooks/useAzureCommunicationHandlers';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';
import { OptionsButton } from 'react-components';
import { containerGapStyle, buttonStyle } from './styles/ConfiguratonScreen.styles';
import { PrimaryButton } from '@fluentui/react';

export type CallJoinType = 'newCall' | 'joinCall' | 'teamsCall';

export interface ConfigurationScreenProps {
  startCallHandler: () => void;
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (isEnabled: boolean) => void;
  callType: CallJoinType;
}

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler, callType } = props;

  const options = useSelector(getCallingSelector(OptionsButton));
  const handlers = useAzureCommunicationHandlers();
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  const startOrJoinText =
    callType === 'newCall' ? 'Start call' : callType === 'teamsCall' ? 'Join Teams Call' : 'Join Call';

  return (
    <CallConfiguration {...{ ...props, screenWidth: window.innerWidth }}>
      <LocalDeviceSettings
        {...options}
        cameraPermissionGranted={cameraPermissionGranted}
        microphonePermissionGranted={microphonePermissionGranted}
        onSelectCamera={handlers.onSelectCamera}
        onSelectMicrophone={handlers.onSelectMicrophone}
        onSelectSpeaker={handlers.onSelectSpeaker}
      />
      <PrimaryButton style={buttonStyle} onClick={() => startCallHandler()} disabled={!microphonePermissionGranted}>
        {startOrJoinText}
      </PrimaryButton>
    </CallConfiguration>
  );
};
