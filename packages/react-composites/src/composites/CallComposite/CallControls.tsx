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

export type CallControlsProps = {
  showParticipantsControl: boolean;
  onEndCallClick(): void;
  compressedMode?: boolean;
  callInvitationURL?: string;
};

export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { callInvitationURL, compressedMode, onEndCallClick } = props;

  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const participantsButtonProps = usePropsFor(ParticipantsButton);
  console.log(participantsButtonProps);
  const optionsButtonProps = usePropsFor(OptionsButton);
  const hangUpButtonProps = usePropsFor(EndCallButton);
  const onHangUp = useCallback(async () => {
    await hangUpButtonProps.onHangUp();
    onEndCallClick();
  }, [hangUpButtonProps, onEndCallClick]);

  return (
    <ControlBar layout="dockedBottom">
      <CameraButton data-ui-id="call-composite-camera-button" {...cameraButtonProps} showLabel={!compressedMode} />
      <MicrophoneButton
        data-ui-id="call-composite-microphone-button"
        {...microphoneButtonProps}
        showLabel={!compressedMode}
      />
      <ScreenShareButton {...screenShareButtonProps} showLabel={!compressedMode} />
      {props.showParticipantsControl && (
        <ParticipantsButton
          data-ui-id="call-composite-participants-button"
          {...participantsButtonProps}
          showLabel={!compressedMode}
          callInvitationURL={callInvitationURL}
        />
      )}
      {/* By setting `persistMenu` to true, we prevent options menu from getting hidden everytime a participant joins or leaves. */}
      <OptionsButton persistMenu={true} {...optionsButtonProps} showLabel={!compressedMode} />
      <EndCallButton
        data-ui-id="call-composite-hangup-button"
        {...hangUpButtonProps}
        onHangUp={onHangUp}
        styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
        showLabel={!compressedMode}
      />
    </ControlBar>
  );
};
