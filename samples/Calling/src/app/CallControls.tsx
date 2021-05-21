// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { ControlBar, MicrophoneButton, CameraButton, ScreenShareButton, EndCallButton } from 'react-components';
import { devicePermissionSelector, useCallingPropsFor as usePropsFor } from '@azure/acs-calling-selector';
import {
  controlBarStyle,
  groupCallLeaveButtonCompressedStyle,
  groupCallLeaveButtonStyle
} from './styles/CallControls.styles';
import { useCallingSelector as useSelector } from '@azure/acs-calling-selector';

export type CallControlsProps = {
  onEndCallClick(): void;
  compressedMode: boolean;
};

export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { compressedMode, onEndCallClick } = props;
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const hangUpButtonProps = usePropsFor(EndCallButton);
  const onHangUp = useCallback(async () => {
    await hangUpButtonProps.onHangUp();
    onEndCallClick();
  }, [hangUpButtonProps, onEndCallClick]);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useSelector(devicePermissionSelector);

  return (
    <ControlBar styles={controlBarStyle}>
      <CameraButton
        {...cameraButtonProps}
        onToggleCamera={() => {
          return cameraButtonProps.onToggleCamera().catch((e) => console.log(e));
        }}
        disabled={!cameraPermissionGranted}
      />
      <MicrophoneButton {...microphoneButtonProps} disabled={!microphonePermissionGranted} />
      <ScreenShareButton {...screenShareButtonProps} />
      <EndCallButton
        {...hangUpButtonProps}
        onHangUp={onHangUp}
        styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
        text={!compressedMode ? 'Leave' : ''}
      />
    </ControlBar>
  );
};
