// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  ParticipantsButton,
  ScreenShareButton
} from '@internal/react-components';
import { groupCallLeaveButtonCompressedStyle, groupCallLeaveButtonStyle } from './styles/CallControls.styles';
import { usePropsFor } from './hooks/usePropsFor';

export type GroupCallControlsProps = {
  onEndCallClick(): void;
  compressedMode?: boolean;
  showParticipants?: boolean;
  callInvitationURL?: string;
};

export const CallControls = (props: GroupCallControlsProps): JSX.Element => {
  const { callInvitationURL, compressedMode, showParticipants = false, onEndCallClick } = props;

  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const participantsButtonProps = usePropsFor(ParticipantsButton);
  const optionsButtonProps = usePropsFor(OptionsButton);
  const hangUpButtonProps = usePropsFor(EndCallButton);
  const onHangUp = useCallback(async () => {
    await hangUpButtonProps.onHangUp();
    onEndCallClick();
  }, [hangUpButtonProps, onEndCallClick]);

  return (
    <ControlBar layout="dockedBottom">
      <CameraButton {...cameraButtonProps} showLabel={!compressedMode} />
      <MicrophoneButton {...microphoneButtonProps} showLabel={!compressedMode} />
      <ScreenShareButton {...screenShareButtonProps} showLabel={!compressedMode} />
      {showParticipants && (
        <ParticipantsButton
          {...participantsButtonProps}
          showLabel={!compressedMode}
          callInvitationURL={callInvitationURL}
        />
      )}
      <OptionsButton persistMenu={true} {...optionsButtonProps} showLabel={!compressedMode} />
      <EndCallButton
        {...hangUpButtonProps}
        onHangUp={onHangUp}
        styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
        showLabel={!compressedMode}
      />
    </ControlBar>
  );
};
