// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  ParticipantMenuItemsCallback,
  ParticipantsButton,
  ScreenShareButton
} from '@internal/react-components';
import React, { useCallback } from 'react';
import { usePropsFor } from '../hooks/usePropsFor';
import { groupCallLeaveButtonCompressedStyle, groupCallLeaveButtonStyle } from '../styles/CallControls.styles';

/**
 * @private
 */
export type CallControlsProps = {
  onEndCallClick(): void;
  callInvitationURL?: string;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: boolean | CallControlOptions;
};

/**
 * Customization options for the control bar in calling experience.
 *
 * @public
 */
export type CallControlOptions = {
  /**
   * Compressed mode decreases the size of buttons in control bar and hides label
   * @defaultValue false
   */
  compressedMode?: boolean;
  /**
   * Show or Hide Camera Button during a call
   * @defaultValue true
   */
  cameraButton?: boolean;
  /**
   * Show or Hide EndCall button during a call.
   * @defaultValue true
   */
  endCallButton?: boolean;
  /**
   * Show or Hide Microphone button during a call.
   * @defaultValue true
   */
  microphoneButton?: boolean;
  /**
    Show or Hide Options button during a call.
   * @defaultValue true
   */
  optionsButton?: boolean;
  /**
    Show or Hide participants button during a call.
   * @defaultValue true
   */
  participantsButton?: boolean;
  /**
    Show or Hide the screen share button during a call.
   * @defaultValue true
   */
  screenShareButton?: boolean;
};

/**
 * @private
 */
export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { callInvitationURL, onEndCallClick, onFetchParticipantMenuItems } = props;
  const options = typeof props.options === 'boolean' ? {} : props.options;

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
      {options?.cameraButton !== false && (
        <CameraButton
          data-ui-id="call-composite-camera-button"
          {...cameraButtonProps}
          showLabel={!options?.compressedMode}
        />
      )}
      {options?.microphoneButton !== false && (
        <MicrophoneButton
          data-ui-id="call-composite-microphone-button"
          {...microphoneButtonProps}
          showLabel={!options?.compressedMode}
        />
      )}
      {options?.screenShareButton !== false && (
        <ScreenShareButton {...screenShareButtonProps} showLabel={!options?.compressedMode} />
      )}
      {options?.participantsButton !== false && (
        <ParticipantsButton
          data-ui-id="call-composite-participants-button"
          {...participantsButtonProps}
          showLabel={!options?.compressedMode}
          callInvitationURL={callInvitationURL}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
        />
      )}
      {/* By setting `persistMenu?` to true, we prevent options menu from getting hidden every time a participant joins or leaves. */}
      {options?.optionsButton !== false && (
        <OptionsButton persistMenu={true} {...optionsButtonProps} showLabel={!options?.compressedMode} />
      )}
      {options?.endCallButton !== false && (
        <EndCallButton
          data-ui-id="call-composite-hangup-button"
          {...hangUpButtonProps}
          onHangUp={onHangUp}
          styles={!options?.compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
          showLabel={!options?.compressedMode}
        />
      )}
    </ControlBar>
  );
};
