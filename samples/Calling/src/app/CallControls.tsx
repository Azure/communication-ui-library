// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { ControlBar, MicrophoneButton, CameraButton, ScreenShareButton, EndCallButton } from '@azure/communication-ui';
import { useHandlers } from './hooks/useHandlers';
import { usePropsFor } from './hooks/usePropsFor';

export type CallControlsProps = {
  onEndCallClick(): void;
};

export const CallControls = (props: CallControlsProps): JSX.Element => {
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
    props.onEndCallClick();
  };

  return (
    <ControlBar>
      <MicrophoneButton {...microphoneButtonProps} {...microphoneButtonHandlers} />
      <CameraButton {...cameraButtonProps} {...cameraButtonHandlers} />
      <ScreenShareButton {...screenShareButtonProps} {...screenShareButtonHandlers} />
      <EndCallButton {...hangUpButtonHandlers} />
    </ControlBar>
  );
};
