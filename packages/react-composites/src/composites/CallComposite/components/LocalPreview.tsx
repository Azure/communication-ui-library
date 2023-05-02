// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack, Text } from '@fluentui/react';
import {
  CameraButton,
  ControlBar,
  MicrophoneButton,
  DevicesButton,
  StreamMedia,
  useTheme,
  VideoTile
} from '@internal/react-components';
import React, { useCallback } from 'react';
import { CallCompositeIcon } from '../../common/icons';
import { useLocale } from '../../localization';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { getLocalMicrophoneEnabled } from '../selectors/baseSelectors';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { localPreviewSelector } from '../selectors/localPreviewSelector';
import { buttonFlyoutIncreasedSizeStyles } from '../styles/Buttons.styles';
import {
  cameraOffLabelStyle,
  localPreviewButtonStyle,
  localPreviewContainerStyleDesktop,
  localPreviewContainerStyleMobile,
  localPreviewTileStyle
} from '../styles/LocalPreview.styles';

/**
 * @private
 */
export interface LocalPreviewProps {
  mobileView: boolean;
  showDevicesButton: boolean;
}

/**
 * @private
 */
export const LocalPreview = (props: LocalPreviewProps): JSX.Element => {
  const locale = useLocale();
  const cameraButtonProps = usePropsFor(CameraButton);
  const localPreviewProps = useSelector(localPreviewSelector);
  const devicesButtonProps = usePropsFor(DevicesButton);
  const { audio: microphonePermissionGranted, video: cameraPermissionGranted } = useSelector(devicePermissionSelector);

  const isLocalMicrophoneEnabled = useSelector(getLocalMicrophoneEnabled);
  const adapter = useAdapter();

  const onToggleMic = useCallback(async () => {
    isLocalMicrophoneEnabled ? adapter.mute() : adapter.unmute();
  }, [adapter, isLocalMicrophoneEnabled]);

  const hasNoDevices =
    devicesButtonProps.cameras.length === 0 &&
    devicesButtonProps.microphones.length === 0 &&
    devicesButtonProps.speakers.length === 0;

  const hasCameras = devicesButtonProps.cameras.length > 0;
  const hasMicrophones = devicesButtonProps.microphones.length > 0;

  const theme = useTheme();
  const onRenderPlaceholder = useCallback((): JSX.Element => {
    return (
      <Stack
        className={mergeStyles({ width: '100%', height: '100%' })}
        verticalAlign="center"
        tokens={{ childrenGap: '0.25rem' }}
      >
        <Stack.Item align="center">
          <CallCompositeIcon
            iconName="LocalPreviewPlaceholder"
            className={mergeStyles(cameraOffLabelStyle, { color: theme.palette.neutralTertiary })}
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Text className={mergeStyles(cameraOffLabelStyle, { color: theme.palette.neutralSecondary })}>
            {locale.strings.call.cameraTurnedOff}
          </Text>
        </Stack.Item>
      </Stack>
    );
  }, [theme, locale.strings.call.cameraTurnedOff]);

  const devicesButtonStyles = props.mobileView
    ? {
        menuStyles: {
          menuItemStyles: buttonFlyoutIncreasedSizeStyles
        }
      }
    : undefined;

  return (
    <Stack
      data-ui-id="call-composite-local-preview"
      className={props.mobileView ? localPreviewContainerStyleMobile : localPreviewContainerStyleDesktop}
    >
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
          <MicrophoneButton
            data-ui-id="call-composite-local-device-settings-microphone-button"
            checked={isLocalMicrophoneEnabled}
            onToggleMicrophone={onToggleMic}
            disabled={!microphonePermissionGranted || !hasMicrophones}
            showLabel={true}
            styles={localPreviewButtonStyle}
          />
          <CameraButton
            data-ui-id="call-composite-local-device-settings-camera-button"
            {...cameraButtonProps}
            showLabel={true}
            disabled={!cameraPermissionGranted || !hasCameras}
            styles={localPreviewButtonStyle}
          />
          {props.showDevicesButton && (
            <DevicesButton
              data-ui-id="call-composite-local-device-settings-options-button"
              {...devicesButtonProps}
              // disable button whilst all other buttons are disabled
              disabled={!microphonePermissionGranted || !cameraPermissionGranted || hasNoDevices}
              showLabel={true}
              styles={devicesButtonStyles}
            />
          )}
        </ControlBar>
      </VideoTile>
    </Stack>
  );
};
