// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import {
  ControlBar,
  MicrophoneButton,
  CameraButton,
  ScreenShareButton,
  EndCallButton,
  useLocale
} from 'react-components';
import {
  controlBarStyle,
  groupCallLeaveButtonCompressedStyle,
  groupCallLeaveButtonStyle
} from './styles/CallControls.styles';
import { useCallingPropsFor as usePropsFor } from 'calling-component-bindings';

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

  const endCallButtonText = useLocale().strings.end_call_button_text;

  return (
    <ControlBar styles={controlBarStyle}>
      <CameraButton {...cameraButtonProps} />
      <MicrophoneButton {...microphoneButtonProps} />
      <ScreenShareButton {...screenShareButtonProps} />
      <EndCallButton
        {...hangUpButtonProps}
        onHangUp={onHangUp}
        styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
        text={!compressedMode ? endCallButtonText : ''}
      />
    </ControlBar>
  );
};
