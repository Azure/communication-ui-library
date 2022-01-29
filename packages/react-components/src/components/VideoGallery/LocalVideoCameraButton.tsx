// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IconButton } from '@fluentui/react';
import React from 'react';
import { OptionsDevice } from '../DevicesButton';

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
}

const localVideoCameraCycleButtonStyles: IButtonStyles = {
  root: {
    position: 'absolute',
    right: '0.2rem',
    top: '0.2rem',
    color: '#FFFFFF', // only shows up on running video feed to we want to force specific colours.
    zIndex: 5, // to layer the button above the video tile.
    background: 'transparent'
  },
  rootFocused: {
    // styles to remove the unwanted white highlight and blue colour after tapping on button.
    color: '#FFFFFF',
    background: 'transparent'
  }
};
/**
 * local video tile camera cycle button - for use on mobile screens only.
 * @private
 */
export const LocalVideoCameraCycleButton = (props: LocalVideoCameraCycleButtonProps): JSX.Element => {
  const { cameras, selectedCamera, onSelectCamera } = props;

  return (
    <IconButton
      styles={localVideoCameraCycleButtonStyles}
      iconProps={{ iconName: 'LocalCameraSwitch' }}
      ariaLabel={'Cycle Camera Button'}
      onClick={() => {
        console.log('clicked');
        if (cameras && selectedCamera !== undefined) {
          const index = cameras.findIndex((camera) => selectedCamera.id === camera.id);
          console.log(index);
          const newCamera = cameras[(index + 1) % cameras.length];
          if (onSelectCamera !== undefined) {
            onSelectCamera(newCamera);
          }
        }
      }}
    />
  );
};
