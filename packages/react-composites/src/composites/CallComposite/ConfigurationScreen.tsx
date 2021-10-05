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
  configurationStackTokensDesktop,
  configurationStackTokensMobile,
  configurationContainerStyleDesktop,
  configurationContainerStyleMobile,
  selectionContainerStyle,
  startCallButtonContainerStyleDesktop,
  startCallButtonContainerStyleMobile,
  startCallButtonStyleMobile,
  titleContainerStyleDesktop,
  titleContainerStyleMobile
} from './styles/CallConfiguration.styles';
import { useLocale } from '../localization';

/**
 * @private
 */
export interface ConfigurationScreenProps {
  mobileView?: boolean;
  startCallHandler(): void;
}

/**
 * @private
 */
export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler, mobileView = false } = props;

  const options = useAdaptedSelector(getCallingSelector(OptionsButton));
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  const locale = useLocale();
  const title = (
    <Stack.Item className={mobileView ? titleContainerStyleMobile : titleContainerStyleDesktop}>
      {locale.strings.call.configurationPageTitle}
    </Stack.Item>
  );

  return (
    <Stack
      horizontal={!mobileView}
      horizontalAlign={mobileView ? 'stretch' : 'center'}
      verticalAlign="center"
      tokens={mobileView ? configurationStackTokensMobile : configurationStackTokensDesktop}
      className={mobileView ? configurationContainerStyleMobile : configurationContainerStyleDesktop}
    >
      {mobileView && title}
      <LocalPreview mobileView={mobileView} />
      <Stack className={mobileView ? undefined : selectionContainerStyle}>
        {!mobileView && title}
        {!mobileView && (
          <LocalDeviceSettings
            {...options}
            {...localDeviceSettingsHandlers}
            cameraPermissionGranted={cameraPermissionGranted}
            microphonePermissionGranted={microphonePermissionGranted}
          />
        )}
        <Stack styles={mobileView ? startCallButtonContainerStyleMobile : startCallButtonContainerStyleDesktop}>
          <StartCallButton
            className={mobileView ? startCallButtonStyleMobile : undefined}
            onClickHandler={startCallHandler}
            isDisabled={!microphonePermissionGranted}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
