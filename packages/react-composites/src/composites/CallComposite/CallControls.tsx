// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ParticipantsButton,
  ScreenShareButton
} from 'react-components';
import { groupCallLeaveButtonCompressedStyle, groupCallLeaveButtonStyle } from './styles/CallControls.styles';
import { usePropsFor } from './hooks/usePropsFor';
import { devicePermissionSelector } from 'calling-component-bindings';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';

export type GroupCallControlsProps = {
  onEndCallClick(): void;
  compressedMode: boolean;
  showParticipants?: boolean;
  callInvitationURL?: string;
};

export const CallControls = (props: GroupCallControlsProps): JSX.Element => {
  const { callInvitationURL, compressedMode, showParticipants = false, onEndCallClick } = props;

  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const participantsButtonProps = usePropsFor(ParticipantsButton);
  const hangUpButtonProps = usePropsFor(EndCallButton);
  const onHangUp = useCallback(async () => {
    await hangUpButtonProps.onHangUp();
    onEndCallClick();
  }, [hangUpButtonProps, onEndCallClick]);
  const { video: cameraPermissionGranted, audio: microphonePermissionGranted } = useAdaptedSelector(
    devicePermissionSelector
  );

  return (
    <ControlBar layout="dockedBottom">
      <CameraButton {...cameraButtonProps} showLabel={!compressedMode} disabled={!cameraPermissionGranted} />
      <MicrophoneButton
        {...microphoneButtonProps}
        showLabel={!compressedMode}
        disabled={!microphonePermissionGranted}
      />
      <ScreenShareButton {...screenShareButtonProps} showLabel={!compressedMode} />
      {showParticipants && (
        <ParticipantsButton
          {...participantsButtonProps}
          showLabel={!compressedMode}
          callInvitationURL={callInvitationURL}
        />
      )}
      <EndCallButton
        {...hangUpButtonProps}
        onHangUp={onHangUp}
        styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
        showLabel={!compressedMode}
      />
    </ControlBar>
  );
};
