// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IconButton, useTheme } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import { OptionsDevice } from './DevicesButton';
import { localVideoCameraCycleButtonStyles } from './styles/VideoGallery.styles';
import { useLocale } from '../localization';

/**
 * @public
 */
export interface LocalVideoCameraCycleButtonProps {
  /** Array of cameras available to the user. */
  cameras?: OptionsDevice[];
  /** Currently selected camera in the local video stream. */
  selectedCamera?: OptionsDevice;
  /** callback function to change video feed. */
  onSelectCamera?: (device: OptionsDevice) => Promise<void>;
  /** label for local video camera switcher */
  label?: string;
  /** description for local video camera switcher */
  ariaDescription?: string;
  /** control to enable large button mode */
  size?: 'small' | 'large';
}

/**
 * local video tile camera cycle button - for use on mobile screens only.
 * @internal
 */
export const LocalVideoCameraCycleButton = (props: LocalVideoCameraCycleButtonProps): JSX.Element => {
  const { cameras, selectedCamera, onSelectCamera, label, ariaDescription, size } = props;
  const theme = useTheme();

  const [waitForCamera, setWaitForCamera] = useState(false);
  const onChangeCameraClick = useCallback(
    async (device: OptionsDevice) => {
      // Throttle changing camera to prevent too many callbacks
      if (onSelectCamera) {
        setWaitForCamera(true);
        try {
          await onSelectCamera(device);
        } finally {
          setWaitForCamera(false);
        }
      }
    },
    [onSelectCamera]
  );

  const disabled = !!waitForCamera;
  const cameraLoadingString = useLocale().strings.cameraButton.tooltipVideoLoadingContent;

  return (
    <IconButton
      data-ui-id={'local-camera-switcher-button'}
      styles={localVideoCameraCycleButtonStyles(theme, size)}
      disabled={disabled}
      iconProps={{ iconName: 'LocalCameraSwitch' }}
      ariaLabel={label}
      ariaDescription={disabled ? cameraLoadingString : ariaDescription}
      aria-live={'polite'}
      onClick={() => {
        if (cameras && cameras.length > 1 && selectedCamera !== undefined) {
          const index = cameras.findIndex((camera) => selectedCamera.id === camera.id);
          const newCamera = cameras[(index + 1) % cameras.length];
          if (newCamera) {
            onChangeCameraClick(newCamera);
          }
        }
      }}
    />
  );
};
