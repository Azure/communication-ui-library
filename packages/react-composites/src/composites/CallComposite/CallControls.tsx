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
  onEndCallClick(): void;
  compressedMode?: boolean;
  callInvitationURL?: string;
} & CallControlVisualElements;

export type CallControlVisualElements = {
  /**
   * Show camera toggle button during a call.
   * @default true
   */
  showCameraButton?: boolean;
  /**
   * Show EndCall toggle button during a call.
   * @default true
   */
  showEndCallButton?: boolean;
  /**
   * Show Microphone toggle button during a call.
   * @default true
   */
  showMicrophoneButton?: boolean;
  /**
   * Show Options button during a call.
   * @default true
   */
  showOptionsButton?: boolean;
  /**
   * Show participants button during a call.
   * @default true
   */
  showParticipantsButton?: boolean;
  /**
   * Show or hide the screen share button during a call.
   * @default true
   */
  showScreenShareButton?: boolean;
};

export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { callInvitationURL, compressedMode, onEndCallClick } = props;

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

  const showCameraButton = props.showCameraButton ?? true;
  const showEndCallButton = props.showEndCallButton ?? true;
  const showMicrophoneButton = props.showMicrophoneButton ?? true;
  const showOptionsButton = props.showOptionsButton ?? true;
  const showParticipantsButton = props.showParticipantsButton ?? true;
  const showScreenShareButton = props.showScreenShareButton ?? true;

  return (
    <ControlBar layout="dockedBottom">
      {showCameraButton && (
        <CameraButton data-ui-id="call-composite-camera-button" {...cameraButtonProps} showLabel={!compressedMode} />
      )}
      {showMicrophoneButton && (
        <MicrophoneButton
          data-ui-id="call-composite-microphone-button"
          {...microphoneButtonProps}
          showLabel={!compressedMode}
        />
      )}
      {showScreenShareButton && <ScreenShareButton {...screenShareButtonProps} showLabel={!compressedMode} />}
      {showParticipantsButton && (
        <ParticipantsButton
          data-ui-id="call-composite-participants-button"
          {...participantsButtonProps}
          showLabel={!compressedMode}
          callInvitationURL={callInvitationURL}
        />
      )}
      {/* By setting `persistMenu` to true, we prevent options menu from getting hidden every time a participant joins or leaves. */}
      {showOptionsButton && <OptionsButton persistMenu={true} {...optionsButtonProps} showLabel={!compressedMode} />}
      {showEndCallButton && (
        <EndCallButton
          data-ui-id="call-composite-hangup-button"
          {...hangUpButtonProps}
          onHangUp={onHangUp}
          styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
          showLabel={!compressedMode}
        />
      )}
    </ControlBar>
  );
};
