// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { CallBridgeContext } from '../../providers/CallBridgeProvider';
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
  const { startCallHandler, joinCall, groupId } = props;

  return (
    <CallBridgeContext.Consumer>
      {({ state: { devices, call }, actions }) => (
        <CallConfiguration
          // {...useSelector(callConfigSelector)}
          {...props}
          localPreviewElement={
            // obviously, LocalPreview demands more props than it actually needs
            // todo: fix
            <LocalPreview
              audioDeviceInfo={devices.selectedMicrophone}
              audioDeviceList={devices.microphones}
              videoDeviceInfo={devices.selectedCamera}
              videoDeviceList={devices.cameras}
              updateAudioDeviceInfo={actions.setMicrophone}
              updateLocalVideoStream={actions.setCamera}
              toggleLocalVideo={actions.toggleCameraOnOff}
              toggleMicrophone={actions.toggleMute}
              localVideoBusy={false} // I don't think this flag should be in the global state
              renderLocalVideo={actions.renderLocalVideo}
              localVideoElement={call.localVideoElement}
              localVideoStream={call.localVideoStream}
              // do we need to specify onErrorCallback here?
            />
          }
        >
          <div>
            <LocalDeviceSettings
              audioDeviceList={devices.microphones}
              audioDeviceInfo={devices.selectedMicrophone}
              videoDeviceList={devices.cameras}
              videoDeviceInfo={devices.selectedCamera}
              updateLocalVideoStream={actions.setCamera}
              updateAudioDeviceInfo={actions.setMicrophone}
              queryCameras={actions.queryCameras}
              queryMicrophones={actions.queryMicrophones}
            />
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
      )}
    </CallBridgeContext.Consumer>
  );
};

const ConfigurationComponent = (props: ConfigurationScreenProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ConfigurationComponentBase, props);

// export default connectFuncsToContext(ConfigurationComponent, MapToCallConfigurationProps);
export default ConfigurationComponent;
