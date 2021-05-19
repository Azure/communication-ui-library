// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
// import { useCallClientContext } from 'react-composites';
import { localStorageAvailable } from './utils/constants';
import { saveDisplayNameToLocalStorage } from './utils/AppUtils';
import { DisplayNameField } from './DisplayNameField';
import { StartCallButton } from './StartCallButton';
import { CallConfiguration } from './CallConfiguration';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { optionsButtonSelector } from '@azure/acs-calling-selector';
import { useSelector } from './hooks/useSelector';
import { useAzureCommunicationHandlers } from './hooks/useAzureCommunicationHandlers';

export interface ConfigurationScreenProps {
  screenWidth: number;
  startCallHandler(): void;
  displayName: string;
  onDisplayNameUpdate: (displayName: string) => void;
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (isEnabled: boolean) => void;
}

export const ConfigurationScreen = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler, onDisplayNameUpdate, displayName } = props;
  const [emptyWarning, setEmptyWarning] = useState(false);
  const [nameTooLongWarning, setNameTooLongWarning] = useState(false);

  const options = useSelector(optionsButtonSelector);
  const handlers = useAzureCommunicationHandlers();

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
        <LocalDeviceSettings
          {...options}
          onSelectCamera={handlers.onSelectCamera}
          onSelectMicrophone={handlers.onSelectMicrophone}
          onSelectSpeaker={handlers.onSelectSpeaker}
        />
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
