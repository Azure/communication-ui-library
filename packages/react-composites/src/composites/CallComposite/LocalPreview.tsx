// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoOff20Filled } from '@fluentui/react-icons';
import { Stack, Text, mergeStyles } from '@fluentui/react';
import React, { useCallback } from 'react';
import { localPreviewContainerStyle, cameraOffLabelStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';
import {
  StreamMedia,
  VideoTile,
  MicrophoneButton,
  ControlBar,
  CameraButton,
  useTheme
} from '@internal/react-components';
import { usePropsFor } from './hooks/usePropsFor';
import { localPreviewSelector } from './selectors/localPreviewSelector';
import { useSelector } from './hooks/useSelector';
import { getLocalMicrophoneEnabled } from './selectors/baseSelectors';
import { useAdapter } from './adapter/CallAdapterProvider';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';
import { useLocale } from '../localization';

export const LocalPreview = (): JSX.Element => {
  const locale = useLocale();
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
          <VideoOff20Filled className={mergeStyles(cameraOffLabelStyle, { color: theme.palette.neutralTertiary })} />
        </Stack.Item>
        <Stack.Item align="center">
          <Text className={mergeStyles(cameraOffLabelStyle, { color: theme.palette.neutralSecondary })}>
            {locale.strings.call.cameraTurnedOff}
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
