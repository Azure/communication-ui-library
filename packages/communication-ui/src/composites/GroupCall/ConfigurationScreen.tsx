// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { useSelector, useActions } from '../../providers/CallBridgeProvider';
import { WithErrorHandling } from '../../components';
import { SetupContainerProps } from '../../consumers';
import { CallConfiguration } from './CallConfiguration';
import { LocalDeviceSettings } from './LocalDeviceSettings';
import { LocalPreview } from './LocalPreview';
import { StartCallButton } from './StartCallButton';

export interface ConfigurationScreenProps extends SetupContainerProps {
  screenWidth: number;
  startCallHandler(): void;
  groupId: string;
}

const ConfigurationComponentBase = (props: ConfigurationScreenProps): JSX.Element => {
  const { startCallHandler, joinCall, groupId, isCallInitialized, screenWidth, displayName, updateDisplayName } = props;
  const localPreviewProps = useSelector(({ devices, call }) => {
    // obviously, LocalPreview demands more props than it actually needs
    // todo: fix
    return {
      audioDeviceInfo: devices.selectedMicrophone,
      audioDeviceList: devices.microphones,
      videoDeviceInfo: devices.selectedCamera,
      videoDeviceList: devices.cameras,
      localVideoBusy: false, // I don't think this flag should be in the global state
      localVideoElement: call.localVideoElement,
      localVideoStream: call.localVideoStream
      // do we need to specify onErrorCallback here?
    };
  });

  const localPreviewActions = useActions((actions) => {
    return {
      updateAudioDeviceInfo: actions.setMicrophone,
      updateLocalVideoStream: actions.setCamera,
      toggleLocalVideo: actions.toggleCameraOnOff,
      toggleMicrophone: actions.toggleMute,
      renderLocalVideo: actions.renderLocalVideo
    };
  });

  const localDeviceSettingsProps = useSelector(({ devices }) => {
    return {
      audioDeviceList: devices.microphones,
      audioDeviceInfo: devices.selectedMicrophone,
      videoDeviceList: devices.cameras,
      videoDeviceInfo: devices.selectedCamera
    };
  });

  const localDeviceSettingsActions = useActions((actions) => {
    return {
      updateLocalVideoStream: actions.setCamera,
      updateAudioDeviceInfo: actions.setMicrophone,
      queryCameras: actions.queryCameras,
      queryMicrophones: actions.queryMicrophones
    };
  });

  return (
    <CallConfiguration
      isCallInitialized={isCallInitialized}
      screenWidth={screenWidth}
      startCallHandler={startCallHandler}
      displayName={displayName}
      updateDisplayName={updateDisplayName}
      joinCall={joinCall}
      localPreviewElement={<LocalPreview {...localPreviewProps} {...localPreviewActions} />}
    >
      <div>
        <LocalDeviceSettings {...localDeviceSettingsProps} {...localDeviceSettingsActions} />
      </div>
      <div>
        <StartCallButton
          onClickHandler={() => {
            startCallHandler();
            joinCall(groupId);
          }}
          isDisabled={false}
        />
      </div>
    </CallConfiguration>
  );
};

const ConfigurationComponent = (props: ConfigurationScreenProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ConfigurationComponentBase, props);

// export default connectFuncsToContext(ConfigurationComponent, MapToCallConfigurationProps);
export default ConfigurationComponent;
