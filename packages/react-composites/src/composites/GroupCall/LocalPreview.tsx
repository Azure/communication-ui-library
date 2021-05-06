// © Microsoft Corporation. All rights reserved.

import { CallVideoOffIcon } from '@fluentui/react-icons-northstar';
import { Stack, Text } from '@fluentui/react';
import React from 'react';
import { localPreviewContainerStyle, cameraOffLabelStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';
import { MapToMediaControlsProps, MediaControlsContainerProps } from './consumers/MapToMediaControlsProps';
import {
  connectFuncsToContext,
  MapToLocalDeviceSettingsProps,
  LocalDeviceSettingsContainerProps,
  MapToErrorBarProps,
  MapToLocalVideoProps
} from '../../consumers';
import {
  StreamMedia,
  VideoTile,
  ErrorBar as ErrorBarComponent,
  MicrophoneButton,
  ControlBar,
  CameraButton
} from 'react-components';
import { useCallContext } from '../../providers';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { WithErrorHandling } from '../../utils/WithErrorHandling';
import { CommunicationUiErrorFromError } from '../../types/CommunicationUiError';

const LocalPreviewComponentBase = (
  props: MediaControlsContainerProps & LocalDeviceSettingsContainerProps & ErrorHandlingProps
): JSX.Element => {
  const isAudioDisabled = !props.audioDeviceInfo || props.audioDeviceList.length === 0;
  const isVideoDisabled = !props.videoDeviceInfo || props.videoDeviceList.length === 0 || props.localVideoBusy;
  // get the stream in here instead of the mapper for now
  // we haven't properly properly exported this component to make it re-usable
  // we should create a MapToLocalPreviewProps, instead of using MapToMediaControlsProps and MapToLocalDeviceSettingsProps
  const { localVideoStream } = useCallContext();

  const { isVideoReady, videoStreamElement } = MapToLocalVideoProps({
    stream: localVideoStream,
    scalingMode: 'Crop'
  });
  const ErrorBar = connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);

  const { localVideoEnabled, isMicrophoneActive } = props;

  return (
    <Stack className={localPreviewContainerStyle}>
      <VideoTile
        styles={localPreviewTileStyle}
        isVideoReady={isVideoReady}
        videoProvider={<StreamMedia videoStreamElement={videoStreamElement} />}
        placeholderProvider={
          <Stack style={{ width: '100%', height: '100%' }} verticalAlign="center">
            <Stack.Item align="center">
              <CallVideoOffIcon />
            </Stack.Item>
            <Stack.Item align="center">
              <Text className={cameraOffLabelStyle}>Your camera is turned off</Text>
            </Stack.Item>
          </Stack>
        }
      >
        <ControlBar layout="floatingBottom">
          <CameraButton
            checked={localVideoEnabled}
            ariaLabel="Video Icon"
            disabled={isVideoDisabled}
            onClick={() => {
              props.toggleLocalVideo().catch((error) => {
                if (props.onErrorCallback) {
                  props.onErrorCallback(CommunicationUiErrorFromError(error));
                } else {
                  throw error;
                }
              });
            }}
          />
          <MicrophoneButton
            ariaLabel="Microphone Icon"
            disabled={isAudioDisabled}
            checked={isMicrophoneActive}
            onClick={() => {
              props.toggleMicrophone().catch((error) => {
                if (props.onErrorCallback) {
                  props.onErrorCallback(CommunicationUiErrorFromError(error));
                } else {
                  throw error;
                }
              });
            }}
          />
        </ControlBar>
      </VideoTile>
      <ErrorBar />
    </Stack>
  );
};

export const LocalPreviewComponent = (
  props: MediaControlsContainerProps & LocalDeviceSettingsContainerProps & ErrorHandlingProps
): JSX.Element => WithErrorHandling(LocalPreviewComponentBase, props);

export const LocalPreview = connectFuncsToContext(
  LocalPreviewComponent,
  MapToLocalDeviceSettingsProps,
  MapToMediaControlsProps
);
