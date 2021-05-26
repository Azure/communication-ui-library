// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { devicePermissionSelector, optionsButtonSelector } from '@azure/calling-component-bindings';
import React from 'react';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { CallConfiguration } from './CallConfiguration';
// TODO: Next PR should move move provider & hooks into the selector package
// and we want to make samples and composite both use from selector package.
import { useHandlers } from './hooks/useHandlers';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { StartCallButton } from './StartCallButton';

export interface ConfigurationScreenProps {
  screenWidth: number;
  startCallHandler(): void;
}

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler } = props;

  const options = useAdaptedSelector(optionsButtonSelector);
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useAdaptedSelector(
    devicePermissionSelector
  );

  return (
    <CallConfiguration {...props}>
      <div>
        <LocalDeviceSettings
          {...options}
          {...localDeviceSettingsHandlers}
          cameraPermissionGranted={cameraPermissionGranted}
          microphonePermissionGranted={microphonePermissionGranted}
        />
      </div>
      <div>
        <StartCallButton onClickHandler={startCallHandler} isDisabled={false} />
      </div>
    </CallConfiguration>
  );
};
