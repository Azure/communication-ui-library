// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { useAdaptedSelector } from '../hooks/useAdaptedSelector';
import { useHandlers } from '../hooks/useHandlers';
import { LocalDeviceSettings } from '../components/LocalDeviceSettings';
import { StartCallButton } from '../components/StartCallButton';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { useSelector } from '../hooks/useSelector';
import { OptionsButton } from '@internal/react-components';
import { getCallingSelector } from '@internal/calling-component-bindings';
import { Stack } from '@fluentui/react';
import { LocalPreview } from '../components/LocalPreview';
import {
  callDetailsStyleDesktop,
  callDetailsStyleMobile,
  configurationStackTokensDesktop,
  configurationStackTokensMobile,
  configurationContainerStyleDesktop,
  configurationContainerStyleMobile,
  selectionContainerStyle,
  startCallButtonContainerStyleDesktop,
  startCallButtonContainerStyleMobile,
  startCallButtonStyleMobile,
  titleContainerStyleDesktop,
  titleContainerStyleMobile,
  callDetailsContainerStylesDesktop
} from '../styles/CallConfiguration.styles';
import { useLocale } from '../../localization';

/**
 * @private
 */
export interface ConfigurationPageProps {
  mobileView: boolean;
  startCallHandler(): void;
}

/**
 * @private
 */
export const ConfigurationPage = (props: ConfigurationPageProps): JSX.Element => {
  const { startCallHandler, mobileView } = props;

  const options = useAdaptedSelector(getCallingSelector(OptionsButton));
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  const locale = useLocale();
  const title = (
    <Stack.Item className={mobileView ? titleContainerStyleMobile : titleContainerStyleDesktop}>
      {locale.strings.call.configurationPageTitle}
    </Stack.Item>
  );

  const callDescription = locale.strings.call.configurationPageCallDetails && (
    <Stack.Item className={mobileView ? callDetailsStyleMobile : callDetailsStyleDesktop}>
      {locale.strings.call.configurationPageCallDetails}
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
      {mobileView && (
        <Stack.Item>
          {title}
          {callDescription}
        </Stack.Item>
      )}
      <LocalPreview mobileView={mobileView} showDevicesButton={mobileView} />
      <Stack className={mobileView ? undefined : selectionContainerStyle}>
        {!mobileView && (
          <>
            <Stack.Item styles={callDetailsContainerStylesDesktop}>
              {title}
              {callDescription}
            </Stack.Item>
            <LocalDeviceSettings
              {...options}
              {...localDeviceSettingsHandlers}
              cameraPermissionGranted={cameraPermissionGranted}
              microphonePermissionGranted={microphonePermissionGranted}
            />
          </>
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
