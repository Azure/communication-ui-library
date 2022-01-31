// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IconButton } from '@fluentui/react';
import React from 'react';
import { OptionsDevice } from '../DevicesButton';
import { localVideoCameraCycleButtonStyles } from '../styles/VideoGallery.styles';

/**
 * @internal
 */
export interface LocalVideoCameraCycleButtonProps {
  /** Array of cameras available to the user. */
  cameras: OptionsDevice[];
  /** Currently selected camera in the local video stream. */
  selectedCamera: OptionsDevice;
  /** callback function to change video feed. */
  onSelectCamera: (device: OptionsDevice) => Promise<void>;
  /** label for local video camera switcher */
  label: string;
}

/**
 * local video tile camera cycle button - for use on mobile screens only.
 * @private
 */
export const LocalVideoCameraCycleButton = (props: LocalVideoCameraCycleButtonProps): JSX.Element => {
  const { cameras, selectedCamera, onSelectCamera, label } = props;

  return (
    <IconButton
      styles={localVideoCameraCycleButtonStyles}
      iconProps={{ iconName: 'LocalCameraSwitch' }}
      ariaLabel={label}
      onClick={() => {
        if (cameras && cameras.length > 1 && selectedCamera !== undefined) {
          const index = cameras.findIndex((camera) => selectedCamera.id === camera.id);
          const newCamera = cameras[(index + 1) % cameras.length];
          if (onSelectCamera !== undefined) {
            onSelectCamera(newCamera);
          }
        }
      }}
    />
  );
};
