// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
// TODO: Next PR should move move provider & hooks into the selector package
// and we want to make samples and composite both use from selector package.
import { useHandlers } from './hooks/useHandlers';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { StartCallButton } from './StartCallButton';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';
import { useSelector } from './hooks/useSelector';
import { OptionsButton } from '@internal/react-components';
import { getCallingSelector } from '@internal/calling-component-bindings';
import { titleContainerStyle } from './styles/ConfigurationScreen.styles';
import { Stack } from '@fluentui/react';
import { LocalPreview } from './LocalPreview';
import { configurationStackTokens, configurationContainer } from './styles/CallConfiguration.styles';

export interface ConfigurationScreenProps {
  startCallHandler(): void;
}

const title = 'Start a call';

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler } = props;

  const options = useAdaptedSelector(getCallingSelector(OptionsButton));
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  return (
    <Stack verticalAlign="center" className={configurationContainer}>
      <Stack horizontal wrap horizontalAlign="center" verticalAlign="center" tokens={configurationStackTokens}>
        <LocalPreview />
        <Stack>
          <div className={titleContainerStyle}>{title}</div>
          <LocalDeviceSettings
            {...options}
            {...localDeviceSettingsHandlers}
            cameraPermissionGranted={cameraPermissionGranted}
            microphonePermissionGranted={microphonePermissionGranted}
          />
          <div>
            <StartCallButton onClickHandler={startCallHandler} isDisabled={!microphonePermissionGranted} />
          </div>
        </Stack>
      </Stack>
    </Stack>
  );
};
