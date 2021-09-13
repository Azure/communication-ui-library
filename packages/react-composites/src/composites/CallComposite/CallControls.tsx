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
  hiddenElements?: CallControlHiddenElements;
};

export type CallControlHiddenElements = {
  /**
   * Hide camera button during a call.
   * @default false
   */
  cameraButton?: boolean;
  /**
   *  Hide EndCall button during a call.
   * @default false
   */
  endCallButton?: boolean;
  /**
   *  Hide Microphone button during a call.
   * @default false
   */
  microphoneButton?: boolean;
  /**
   * Hide Options button during a call.
   * @default false
   */
  optionsButton?: boolean;
  /**
   * Hide participants button during a call.
   * @default false
   */
  participantsButton?: boolean;
  /**
   * Hide the screen share button during a call.
   * @default false
   */
  screenShareButton?: boolean;
};

export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { callInvitationURL, compressedMode, onEndCallClick, hiddenElements } = props;

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

  console.log('HIDDEN ELEMENTS', hiddenElements);

  return (
    <ControlBar layout="dockedBottom">
      {hiddenElements?.cameraButton !== true && (
        <CameraButton data-ui-id="call-composite-camera-button" {...cameraButtonProps} showLabel={!compressedMode} />
      )}
      {hiddenElements?.microphoneButton !== true && (
        <MicrophoneButton
          data-ui-id="call-composite-microphone-button"
          {...microphoneButtonProps}
          showLabel={!compressedMode}
        />
      )}
      {hiddenElements?.screenShareButton !== true && (
        <ScreenShareButton {...screenShareButtonProps} showLabel={!compressedMode} />
      )}
      {hiddenElements?.participantsButton !== true && (
        <ParticipantsButton
          data-ui-id="call-composite-participants-button"
          {...participantsButtonProps}
          showLabel={!compressedMode}
          callInvitationURL={callInvitationURL}
        />
      )}
      {/* By setting `persistMenu?` to true, we prevent options menu from getting hidden every time a participant joins or leaves. */}
      {hiddenElements?.optionsButton !== true && (
        <OptionsButton persistMenu={true} {...optionsButtonProps} showLabel={!compressedMode} />
      )}
      {hiddenElements?.endCallButton !== true && (
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
