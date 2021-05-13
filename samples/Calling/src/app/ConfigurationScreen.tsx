// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { useCallingContext } from 'react-composites';
import { localStorageAvailable } from './utils/constants';
import { saveDisplayNameToLocalStorage } from './utils/AppUtils';
import { DisplayNameField } from './DisplayNameField';
import { StartCallButton } from './StartCallButton';
import { CallConfiguration } from './CallConfiguration';
import { LocalDeviceSettingsComponent } from './LocalDeviceSettings';
import { CameraPreviewButton } from './LocalPreview';
import { optionsButtonSelector } from '@azure/acs-calling-selector';
import { VideoDeviceInfo } from '@azure/communication-calling';
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

  const { displayName } = useCallingContext();

  const options = useSelector(optionsButtonSelector);
  const handlers = useHandlers(LocalDeviceSettingsComponent);
  const localPreviewHandlers = useHandlers(CameraPreviewButton);

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
        <LocalDeviceSettingsComponent
          {...options}
          onSelectCamera={(device: VideoDeviceInfo) => {
            if (options.selectedCamera) {
              localPreviewHandlers.onPreviewStopVideo({ source: options.selectedCamera, mediaStreamType: 'Video' });
            }
            localPreviewHandlers.onPreviewStartVideo({ source: device, mediaStreamType: 'Video' });
            return handlers.onSelectCamera(device);
          }}
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
