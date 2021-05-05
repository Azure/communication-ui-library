// © Microsoft Corporation. All rights reserved.

import React, { useState } from 'react';
import {
  connectFuncsToContext,
  MapToCallConfigurationProps,
  SetupContainerProps,
  useCallContext,
  useCallingContext
} from '@azure/communication-ui';
import { localStorageAvailable } from './utils/constants';
import { saveDisplayNameToLocalStorage } from './utils/AppUtils';
import { DisplayNameField } from './DisplayNameField';
import { StartCallButton } from './StartCallButton';
import { CallConfiguration } from './CallConfiguration';
import { LocalDeviceSettingsComponent } from './LocalDeviceSettings';
import { LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import { useSelector } from './hooks/useSelector';
import { optionsButtonSelector } from '@azure/acs-calling-selector';
import { useHandlers } from './hooks/useHandlers';

export interface ConfigurationScreenProps extends SetupContainerProps {
  screenWidth: number;
  startCallHandler(): void;
  onDisplayNameUpdate: (displayName: string) => void;
}

export const ConfigurationComponent = (props: ConfigurationScreenProps): JSX.Element => {
  const { displayName, startCallHandler, onDisplayNameUpdate } = props;
  const [emptyWarning, setEmptyWarning] = useState(false);
  const [nameTooLongWarning, setNameTooLongWarning] = useState(false);

  const { setVideoDeviceInfo, videoDeviceInfo } = useCallingContext();
  const { setLocalVideoStream } = useCallContext();

  const options = useSelector(optionsButtonSelector, { callId: '' });
  const handlers = useHandlers(LocalDeviceSettingsComponent);

  const onSelectCamera = async (device: VideoDeviceInfo): Promise<void> => {
    setVideoDeviceInfo(device);
    const newLocalVideoStream = new LocalVideoStream(device);
    setLocalVideoStream(newLocalVideoStream);
    await handlers.onSelectCamera(device);
  };

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
          selectedCamera={videoDeviceInfo}
          onSelectCamera={onSelectCamera}
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

export default connectFuncsToContext(ConfigurationComponent, MapToCallConfigurationProps);
