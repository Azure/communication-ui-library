// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { ControlBar, MicrophoneButton, CameraButton, ScreenShareButton, EndCallButton } from '@azure/communication-ui';
import { useHandlers } from './hooks/useHandlers';
import { usePropsFor } from './hooks/usePropsFor';
import {
  controlBarStyle,
  groupCallLeaveButtonCompressedStyle,
  groupCallLeaveButtonStyle
} from './styles/CallControls.styles';

export type CallControlsProps = {
  onEndCallClick(): void;
  compressedMode: boolean;
};

export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { compressedMode, onEndCallClick } = props;
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const microphoneButtonHandlers = useHandlers(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const cameraButtonHandlers = useHandlers(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const screenShareButtonHandlers = useHandlers(ScreenShareButton);
  const hangUpButtonHandlers = useHandlers(EndCallButton);
  const hangUpFunctionFromDeclarative = hangUpButtonHandlers.onHangUp;

  hangUpButtonHandlers.onHangUp = async () => {
    await hangUpFunctionFromDeclarative();
    onEndCallClick();
  };

  return (
    <ControlBar styles={controlBarStyle}>
      <MicrophoneButton {...microphoneButtonProps} {...microphoneButtonHandlers} />
      <CameraButton {...cameraButtonProps} {...cameraButtonHandlers} />
      <ScreenShareButton {...screenShareButtonProps} {...screenShareButtonHandlers} />
      <EndCallButton
        {...hangUpButtonHandlers}
        styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
        text={!compressedMode ? 'Leave' : ''}
      />
    </ControlBar>
  );
};
