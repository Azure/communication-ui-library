// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IconButton } from '@fluentui/react';
import React from 'react';
import { OptionsDevice } from '../DevicesButton';

export interface LocalVideoCameraButtonProps {
  // array of cameras to cycle through
  cameras?: OptionsDevice[];
  // selected camera
  selectedCamera?: OptionsDevice;
  // callBack to cycleCamera
  cycleCamera: (device: OptionsDevice) => Promise<void>;
}
/**
 *
 * @param props
 * @returns
 * @private
 */
export const LocalVideoCameraButton = (props: LocalVideoCameraButtonProps): JSX.Element => {
  const { cameras, selectedCamera, cycleCamera } = props;

  return (
    <IconButton
      iconProps={{ iconName: 'Camera Switch' }}
      ariaLabel={'Cycle Camera Button'} // this needed? is there narrator on mobile?
      onClick={() => {
        if (cameras && selectedCamera !== undefined) {
          let newCamera;
          if (cameras?.indexOf(selectedCamera) < cameras.length) {
            newCamera = cameras[cameras?.indexOf(selectedCamera) + 1];
            if (newCamera !== undefined) {
              cycleCamera(newCamera);
            }
          } else {
            newCamera = cameras[0];
            if (newCamera !== undefined) {
              cycleCamera(newCamera);
            }
          }
        }
      }}
    />
  );
};
