// © Microsoft Corporation. All rights reserved.

import React from 'react';
import {
  ControlBar,
  MicrophoneButton,
  CameraButton,
  ScreenShareButton,
  EndCallButton,
  useCallingContext
} from '@azure/communication-ui';
import { Call } from '@azure/communication-calling';
import { microphoneButtonSelector, cameraButtonSelector, screenShareButtonSelector } from '@azure/acs-calling-selector';
import { useSelector } from './hooks/useSelector';
import { useHandlers } from './hooks/useHandlers';

export type CallControlsProps = {
  call: Call;
};

export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { call } = props;
  const { videoDeviceInfo } = useCallingContext();
  const microphoneButtonProps = useSelector(microphoneButtonSelector, { callId: call.id });
  const microphoneButtonHandlers = useHandlers(MicrophoneButton);
  const cameraButtonProps = useSelector(cameraButtonSelector, { callId: call.id });
  const cameraButtonHandlers = useHandlers(CameraButton) as any;
  const screenShareButtonProps = useSelector(screenShareButtonSelector, { callId: call.id });
  const screenShareButtonHandlers = useHandlers(ScreenShareButton);
  const hangUpButtonHandlers = useHandlers(EndCallButton);

  const onToggleCamera = async (): Promise<void> => {
    await cameraButtonHandlers.onToggleCamera(videoDeviceInfo);
  };

  return (
    <ControlBar>
      <MicrophoneButton {...microphoneButtonProps} {...microphoneButtonHandlers} />
      <CameraButton {...cameraButtonProps} onToggleCamera={onToggleCamera} />
      <ScreenShareButton {...screenShareButtonProps} {...screenShareButtonHandlers} />
      <EndCallButton {...hangUpButtonHandlers} />
    </ControlBar>
  );
};
