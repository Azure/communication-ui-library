// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallVideoOffIcon } from '@fluentui/react-icons-northstar';
import { Stack, Text } from '@fluentui/react';
import { localPreviewContainerStyle, cameraOffLabelStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';
import React, { useState } from 'react';
import { MapToMediaControlsProps, MediaControlsContainerProps } from './consumers/MapToMediaControlsProps';
import {
  CameraButton,
  ControlBar,
  ErrorBar as ErrorBarComponent,
  MicrophoneButton,
  StreamMedia,
  VideoTile
} from 'react-components';
import {
  connectFuncsToContext,
  ErrorHandlingProps,
  WithErrorHandling,
  CommunicationUiErrorFromError,
  MapToErrorBarProps,
  MapToLocalDeviceSettingsProps,
  LocalDeviceSettingsContainerProps
} from 'react-composites';
import { useSelector } from './hooks/useSelector';
import { useHandlers } from './hooks/useHandlers';
import { optionsButtonSelector } from '@azure/acs-calling-selector';

import { VideoDeviceInfo } from '@azure/communication-calling';
import { LocalVideoStream } from 'calling-stateful-client';
type CameraPreviewButtonProps = {
  checked: boolean;
  onPreviewStartVideo: (stream: LocalVideoStream) => Promise<void>;
  onPreviewStopVideo: (stream: LocalVideoStream) => Promise<void>;
  device: VideoDeviceInfo;
};
const CameraPreviewButton = (props: CameraPreviewButtonProps): JSX.Element | null => {
  const { checked, onPreviewStartVideo, onPreviewStopVideo, device } = props;
  const onClick = (): void => {
    if (device) {
      if (checked) {
        onPreviewStartVideo({ source: device, mediaStreamType: 'Video' });
      } else {
        onPreviewStopVideo({ source: device, mediaStreamType: 'Video' });
      }
    }
  };
  return <CameraButton onClick={onClick} />;
};

const LocalPreviewComponentBase = (
  props: MediaControlsContainerProps & LocalDeviceSettingsContainerProps & ErrorHandlingProps
): JSX.Element => {
  const isAudioDisabled = !props.audioDeviceInfo || props.audioDeviceList.length === 0;
  // get the stream in here instead of the mapper for now
  // we haven't properly properly exported this component to make it re-usable
  // we should create a MapToLocalPreviewProps, instead of using MapToMediaControlsProps and MapToLocalDeviceSettingsProps

  // const cameraButtonProps = usePropsFor(CameraButton);
  // const cameraButtonHandlers = useHandlers(CameraButton);
  const dummyHandlers = useHandlers(CameraPreviewButton);
  const optionsButtonProps = useSelector(optionsButtonSelector);
  const unparentedView = optionsButtonProps.unparentedViews[0];
  let videoStreamElement = null;
  if (unparentedView) {
    videoStreamElement = unparentedView.target;
  }

  const [previewOn, setPreviewOn] = useState<boolean>(videoStreamElement !== null);

  const ErrorBar = connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);

  const { isMicrophoneActive } = props;

  return (
    <Stack className={localPreviewContainerStyle}>
      <VideoTile
        styles={localPreviewTileStyle}
        isVideoReady={previewOn}
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
            // {...cameraButtonProps}
            checked={previewOn}
            onClick={() => {
              if (previewOn) {
                dummyHandlers.onPreviewStopVideo({
                  source: optionsButtonProps.cameras[0],
                  mediaStreamType: 'Video'
                });
                setPreviewOn(false);
              } else {
                dummyHandlers.onPreviewStartVideo({
                  source: optionsButtonProps.cameras[0],
                  mediaStreamType: 'Video'
                });
                setPreviewOn(true);
              }
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
