// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IconButton, mergeStyles } from '@fluentui/react';
import React from 'react';
import { OptionsDevice } from '../DevicesButton';

export interface LocalVideoCameraButtonProps {
  // array of cameras to cycle through
  cameras?: OptionsDevice[];
  //
  currentCamera?: OptionsDevice;
  // callBack to cycleCamera
  cycleCamera: (device: OptionsDevice) => Promise<void>;
}
/**
 * local video tile camera cycle button - for use on mobile screens only.
 * @param props
 * @returns
 * @private
 */
export const LocalVideoCameraButton = (props: LocalVideoCameraButtonProps): JSX.Element => {
  const { cameras, currentCamera, cycleCamera } = props;
  const localCameraSwitcherStyles: IButtonStyles = {
    root: {
      zIndex: '3',
      position: 'absolute',
      right: '0',
      background: 'blue'
    }
  };
  return (
    <IconButton
      styles={localCameraSwitcherStyles}
      iconProps={{ iconName: 'CameraSwitch' }}
      ariaLabel={'Cycle Camera Button'}
      onClick={() => {
        if (cameras && currentCamera !== undefined) {
          let newCamera;
          if (cameras?.indexOf(currentCamera) < cameras.length) {
            newCamera = cameras[cameras?.indexOf(currentCamera) + 1];
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
