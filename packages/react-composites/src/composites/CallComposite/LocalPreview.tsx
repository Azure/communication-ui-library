// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoOff20Filled } from '@fluentui/react-icons';
import { Stack, Text } from '@fluentui/react';
import React, { useCallback } from 'react';
import { localPreviewContainerStyle, cameraOffLabelStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';
import { StreamMedia, VideoTile, MicrophoneButton, ControlBar, CameraButton } from '@internal/react-components';
import { usePropsFor } from './hooks/usePropsFor';
import { localPreviewSelector } from './selectors/localPreviewSelector';
import { useSelector } from './hooks/useSelector';
import { getLocalMicrophoneEnabled } from './selectors/baseSelectors';
import { useAdapter } from './adapter/CallAdapterProvider';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';

const onRenderPlaceholder = (): JSX.Element => {
  return (
    <Stack style={{ width: '100%', height: '100%' }} verticalAlign="center">
      <Stack.Item align="center">
        <VideoOff20Filled primaryFill="currentColor" />
      </Stack.Item>
      <Stack.Item align="center">
        <Text className={cameraOffLabelStyle}>Your camera is turned off.</Text>
      </Stack.Item>
    </Stack>
  );
};

export const LocalPreview = (): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const localPreviewProps = useSelector(localPreviewSelector);
  const { audio: microphonePermissionGranted, video: cameraPermissionGranted } = useSelector(devicePermissionSelector);

  const isLocalMicrophoneEnabled = useSelector(getLocalMicrophoneEnabled);
  const adapter = useAdapter();

  const onToggleMic = useCallback(async () => {
    isLocalMicrophoneEnabled ? adapter.mute() : adapter.unmute();
  }, [adapter, isLocalMicrophoneEnabled]);

  return (
    <Stack data-ui-id="call-composite-local-preview" className={localPreviewContainerStyle}>
      <VideoTile
        styles={localPreviewTileStyle}
        isVideoReady={!!localPreviewProps.videoStreamElement}
        renderElement={<StreamMedia videoStreamElement={localPreviewProps.videoStreamElement} />}
        onRenderPlaceholder={onRenderPlaceholder}
      >
        <ControlBar layout="floatingBottom">
          <CameraButton {...cameraButtonProps} showLabel={true} disabled={!cameraPermissionGranted} />
          <MicrophoneButton
            checked={isLocalMicrophoneEnabled}
            onToggleMicrophone={onToggleMic}
            disabled={!microphonePermissionGranted}
            showLabel={true}
          />
        </ControlBar>
      </VideoTile>
    </Stack>
  );
};
