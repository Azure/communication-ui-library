// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, mergeStyles, Stack, Text } from '@fluentui/react';
import {
  CameraButton,
  ControlBar,
  MicrophoneButton,
  StreamMedia,
  useTheme,
  VideoTile
} from '@internal/react-components';
import React, { useCallback } from 'react';
import { useAdapter } from './adapter/CallAdapterProvider';
import { usePropsFor } from './hooks/usePropsFor';
import { useSelector } from './hooks/useSelector';
import { getLocalMicrophoneEnabled } from './selectors/baseSelectors';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';
import { localPreviewSelector } from './selectors/localPreviewSelector';
import { cameraOffLabelStyle, localPreviewContainerStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';

export const LocalPreview = (): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const localPreviewProps = useSelector(localPreviewSelector);
  const { audio: microphonePermissionGranted, video: cameraPermissionGranted } = useSelector(devicePermissionSelector);

  const isLocalMicrophoneEnabled = useSelector(getLocalMicrophoneEnabled);
  const adapter = useAdapter();

  const onToggleMic = useCallback(async () => {
    isLocalMicrophoneEnabled ? adapter.mute() : adapter.unmute();
  }, [adapter, isLocalMicrophoneEnabled]);

  const theme = useTheme();
  const onRenderPlaceholder = useCallback((): JSX.Element => {
    return (
      <Stack className={mergeStyles({ width: '100%', height: '100%' })} verticalAlign="center">
        <Stack.Item align="center">
          <Icon
            iconName="LocalPreviewPlaceholder"
            className={mergeStyles(cameraOffLabelStyle, { color: theme.palette.neutralTertiary })}
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Text className={mergeStyles(cameraOffLabelStyle, { color: theme.palette.neutralSecondary })}>
            Your camera is turned off.
          </Text>
        </Stack.Item>
      </Stack>
    );
  }, [theme]);

  return (
    <Stack data-ui-id="call-composite-local-preview" className={localPreviewContainerStyle}>
      <VideoTile
        styles={localPreviewTileStyle}
        renderElement={
          localPreviewProps?.videoStreamElement ? (
            <StreamMedia videoStreamElement={localPreviewProps.videoStreamElement} />
          ) : undefined
        }
        onRenderPlaceholder={onRenderPlaceholder}
      >
        <ControlBar layout="floatingBottom">
          <CameraButton
            data-ui-id="call-composite-local-device-settings-camera-button"
            {...cameraButtonProps}
            showLabel={true}
            disabled={!cameraPermissionGranted}
          />
          <MicrophoneButton
            data-ui-id="call-composite-local-device-settings-microphone-button"
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
