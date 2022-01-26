// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IconButton } from '@fluentui/react';
import React from 'react';
import { OptionsDevice } from '../DevicesButton';

export interface LocalVideoCameraButtonProps {
  /** Array of cameras available to the user. */
  cameras?: OptionsDevice[];
  /** Currently selected camera in the local video stream. */
  currentCamera?: OptionsDevice;
  /** callback function to change video feed. */
  setCamera: (device: OptionsDevice) => Promise<void>;
}
/**
 * local video tile camera cycle button - for use on mobile screens only.
 * @private
 */
export const LocalVideoCameraCycleButton = (props: LocalVideoCameraButtonProps): JSX.Element => {
  const { cameras, currentCamera, setCamera } = props;
  const localVideoCameraCycleButtonStyles: IButtonStyles = {
    root: {
      position: 'absolute',
      right: '0',
      color: 'white' // only shows up on running video feed to we want to force specific colours.
    }
  };
  return (
    <IconButton
      styles={localVideoCameraCycleButtonStyles}
      iconProps={{ iconName: 'LocalCameraSwitch' }}
      ariaLabel={'Cycle Camera Button'}
      onClick={() => {
        if (cameras && currentCamera !== undefined) {
          const index = cameras.indexOf(currentCamera);
          const newCamera = cameras[(index + 1) % cameras.length];
          setCamera(newCamera);
        }
      }}
    />
  );
};
