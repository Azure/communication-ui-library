// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallVideoOffIcon } from '@fluentui/react-icons-northstar';
import { Stack, Text } from '@fluentui/react';
import React, { useCallback } from 'react';
import { localPreviewContainerStyle, cameraOffLabelStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';
import {
  StreamMedia,
  VideoTile,
  MicrophoneButton,
  ControlBar,
  CameraButton,
  VideoStreamOptions
} from 'react-components';
import { usePropsFor } from './hooks/usePropsFor';
import { localPreviewSelector } from './selectors/localPreviewSelector';
import { useSelector } from './hooks/useSelector';
import { getLocalMicrophoneEnabled } from './selectors/baseSelectors';
import { useAdapter } from './adapter/CallAdapterProvider';
import { devicePermissionSelector } from 'calling-component-bindings';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';

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

const localVideoViewOption = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

export const LocalPreview = (): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const localPreviewProps = useSelector(localPreviewSelector);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useAdaptedSelector(
    devicePermissionSelector
  );

  const isLocalMicrophoneEnabled = useSelector(getLocalMicrophoneEnabled);
  const adapter = useAdapter();

  const onToggleMic = useCallback(async () => {
    isLocalMicrophoneEnabled ? adapter.mute() : adapter.unmute();
  }, [adapter, isLocalMicrophoneEnabled]);

  const onToggleCamera = async (): Promise<void> => {
    await cameraButtonProps.onToggleCamera(localVideoViewOption);
  };

  return (
    <Stack className={localPreviewContainerStyle}>
      <VideoTile
        styles={localPreviewTileStyle}
        isVideoReady={!!localPreviewProps.videoStreamElement}
        renderElement={<StreamMedia videoStreamElement={localPreviewProps.videoStreamElement} />}
        onRenderPlaceholder={onRenderPlaceholder}
      >
        <ControlBar layout="floatingBottom">
          <CameraButton {...cameraButtonProps} disabled={!cameraPermissionGranted} onToggleCamera={onToggleCamera} />
          <MicrophoneButton
            checked={isLocalMicrophoneEnabled}
            onToggleMicrophone={onToggleMic}
            disabled={!microphonePermissionGranted}
          />
        </ControlBar>
      </VideoTile>
    </Stack>
  );
};
