// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CameraButton,
  ControlBar,
  ControlBarButtonStyles,
  DevicesButton,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton,
  usePropsFor
} from '@azure/communication-react';
import React from 'react';

/**
 * This example demonstrates how to customize the styles of the Call ControlBar buttons.
 * The buttons are styled with a yellow background color.
 *
 * @returns {JSX.Element} A styled ControlBar with custom button styles.
 */
export const StyledControlBarExample = (): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const deviceButtonProps = usePropsFor(DevicesButton);
  const endCallButtonProps = usePropsFor(EndCallButton);

  const controlBarButtonStyle: ControlBarButtonStyles = {
    root: {
      background: '#ffff00'
    }
  };

  return (
    <>
      <h3>An example of custom sytled Call ControlBar:</h3>
      <br />
      <ControlBar layout={'horizontal'}>
        <CameraButton styles={controlBarButtonStyle} {...cameraButtonProps} />
        <MicrophoneButton styles={controlBarButtonStyle} {...microphoneButtonProps} />
        <ScreenShareButton styles={controlBarButtonStyle} {...screenShareButtonProps} />
        <DevicesButton styles={controlBarButtonStyle} {...deviceButtonProps} />
        <EndCallButton styles={controlBarButtonStyle} {...endCallButtonProps} />
      </ControlBar>
    </>
  );
};
