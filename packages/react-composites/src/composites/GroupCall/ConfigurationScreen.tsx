// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { optionsButtonSelector } from '@azure/acs-calling-selector';
import React from 'react';
import { CallConfiguration } from './CallConfiguration';
// TODO: Next PR should move move provider & hooks into the selector package
// and we want to make samples and composite both use from selector package.
import { useHandlers } from './hooks/useHandlers';
import { useSelector } from './hooks/useSelector';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { StartCallButton } from './StartCallButton';

export interface ConfigurationScreenProps {
  screenWidth: number;
  startCallHandler(): void;
  groupId: string;
}

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler } = props;

  const options = useSelector(optionsButtonSelector);
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);

  return (
    <CallConfiguration {...props}>
      <div>
        <LocalDeviceSettings {...options} {...localDeviceSettingsHandlers} />
      </div>
      <div>
        <StartCallButton onClickHandler={startCallHandler} isDisabled={false} />
      </div>
    </CallConfiguration>
  );
};
