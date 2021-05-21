// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { CallVideoOffIcon } from '@fluentui/react-icons-northstar';
import { Stack, Text } from '@fluentui/react';
import { localPreviewContainerStyle, cameraOffLabelStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';
import { CameraButton, ControlBar, MicrophoneButton, StreamMedia, VideoTile } from 'react-components';
import { useCallingSelector as useSelector, useCallingPropsFor as usePropsFor } from '@azure/acs-calling-selector';
import { localPreviewSelector } from './selectors/localPreviewSelector';
import { DeviceAccess } from '@azure/communication-calling';

const onRenderPlaceholder = (): JSX.Element => {
  return (
    <Stack style={{ width: '100%', height: '100%' }} verticalAlign="center">
      <Stack.Item align="center">
        <CallVideoOffIcon />
      </Stack.Item>
      <Stack.Item align="center">
        <Text className={cameraOffLabelStyle}>Your camera is turned off.</Text>
      </Stack.Item>
    </Stack>
  );
};

export interface LocalPreviewProps {
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (isEnabled: boolean) => void;
  deviceAccess?: DeviceAccess;
}

export const LocalPreview = (props: LocalPreviewProps): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const localPreviewProps = useSelector(localPreviewSelector);

  const cameraPermissionGranted = useMemo(() => {
    if (!props.deviceAccess || !props.deviceAccess.video) {
      return false;
    }

    return true;
  }, [props.deviceAccess]);

  const microphonePermissionGranted = useMemo(() => {
    if (!props.deviceAccess || !props.deviceAccess.audio) {
      return false;
    }

    return true;
  }, [props.deviceAccess]);

  console.log('deviceAccess', props.deviceAccess);
  console.log('camera disabled: ', !cameraPermissionGranted);
  console.log('microphone disabled: ', !microphonePermissionGranted);

  return (
    <Stack className={localPreviewContainerStyle}>
      <VideoTile
        styles={localPreviewTileStyle}
        isVideoReady={!!localPreviewProps.videoStreamElement}
        renderElement={<StreamMedia videoStreamElement={localPreviewProps.videoStreamElement} />}
        onRenderPlaceholder={onRenderPlaceholder}
        isMirrored={true}
      >
        <ControlBar layout="floatingBottom">
          <CameraButton {...cameraButtonProps} disabled={!cameraPermissionGranted} />
          <MicrophoneButton
            disabled={!microphonePermissionGranted}
            checked={props.isMicrophoneOn}
            onToggleMicrophone={async () => {
              props.setIsMicrophoneOn(!props.isMicrophoneOn);
            }}
          />
        </ControlBar>
      </VideoTile>
    </Stack>
  );
};
