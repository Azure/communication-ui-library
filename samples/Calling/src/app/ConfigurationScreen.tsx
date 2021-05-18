// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { CallClientProvider } from 'react-composites';
import { localStorageAvailable } from './utils/constants';
import { saveDisplayNameToLocalStorage } from './utils/AppUtils';
import { DisplayNameField } from './DisplayNameField';
import { StartCallButton } from './StartCallButton';
import { CallConfiguration } from './CallConfiguration';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { optionsButtonSelector } from '@azure/acs-calling-selector';
import { useSelector } from './hooks/useSelector';
import { useHandlers } from './hooks/useHandlers';

export interface ConfigurationScreenProps {
  screenWidth: number;
  startCallHandler(): void;
  onDisplayNameUpdate: (displayName: string) => void;
}

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler, onDisplayNameUpdate } = props;
  const [emptyWarning, setEmptyWarning] = useState(false);
  const [nameTooLongWarning, setNameTooLongWarning] = useState(false);

  const { displayName } = CallClientProvider.useCallClientContext();

  const options = useSelector(optionsButtonSelector);
  const localDeviceSettingsHandlers = useHandlers(LocalDeviceSettings);

  return (
    <CallConfiguration {...props}>
      <DisplayNameField
        setName={onDisplayNameUpdate}
        defaultName={displayName}
        setEmptyWarning={setEmptyWarning}
        isEmpty={emptyWarning}
        isNameLengthExceedLimit={nameTooLongWarning}
        setNameLengthExceedLimit={setNameTooLongWarning}
      />
      <div>
        <LocalDeviceSettings {...options} {...localDeviceSettingsHandlers} />
      </div>
      <div>
        <StartCallButton
          onClickHandler={async () => {
            if (localStorageAvailable) {
              saveDisplayNameToLocalStorage(displayName);
            }
            startCallHandler();
          }}
          isDisabled={!displayName || emptyWarning || nameTooLongWarning}
        />
      </div>
    </CallConfiguration>
  );
};
