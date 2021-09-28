// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { useHandlers } from './hooks/useHandlers';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { StartCallButton } from './StartCallButton';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';
import { useSelector } from './hooks/useSelector';
import { OptionsButton } from '@internal/react-components';
import { getCallingSelector } from '@internal/calling-component-bindings';
import { Stack } from '@fluentui/react';
import { LocalPreview } from './LocalPreview';
import {
  configurationStackTokens,
  configurationContainer,
  selectionContainerStyle,
  titleContainerStyle
} from './styles/CallConfiguration.styles';
import { useLocale } from '../localization';

/**
 * @private
 */
export interface ConfigurationScreenProps {
  startCallHandler(): void;
}

/**
 * @private
 */
export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler } = props;

  const options = useAdaptedSelector(getCallingSelector(OptionsButton));
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  const locale = useLocale();
  const title = locale.strings.call.configurationPageTitle;

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      tokens={configurationStackTokens}
      className={configurationContainer}
    >
      <LocalPreview />
      <Stack className={selectionContainerStyle}>
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
  );
};
