// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, DefaultPalette as palette } from '@fluentui/react';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  ParticipantMenuItemsCallback,
  ParticipantsButton,
  ScreenShareButton,
  useTheme
} from '@internal/react-components';
import React, { useCallback, useMemo } from 'react';
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

  /**
   * Inject custom buttons in the call controls.
   */
  customButtons?: CustomCallControlsButton[];
};

/**
 * Placement for a custom button injected in the {@link CallControls}.
 *
 * 'first': Place the button on the left end (right end in rtl mode).
 * 'afterCameraButton': Place the button on the right (left in rtl mode) of the camera button.
 * ... and so on.
 *
 * It is an error to place the button in reference to another button that has
 * been disabled via {@link CallControlOptions}.
 *
 * Multiple buttons placed in the same position are appeneded in order.
 * E.g., if two buttons are placed 'first', they'll both appear on the left end (right end in rtl mode)
 * in the order provided.
 *
 * @alpha
 */
export type ControlBarButtonPlacement =
  | 'first'
  | 'afterCameraButton'
  | 'afterEndCallButton'
  | 'afterMicrophoneButton'
  | 'afterOptionsButton'
  | 'afterParticipantsButton'
  | 'afterScreenShareButton';

/**
 * A custom button to inject in the {@link CallControls}.
 *
 * @alpha
 */
export interface CustomCallControlsButton {
  button: DefaultButton;
  placement: ControlBarButtonPlacement;
}

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

  const theme = useTheme();

  const onHangUp = useCallback(async () => {
    await hangUpButtonProps.onHangUp();
    onEndCallClick();
  }, [hangUpButtonProps, onEndCallClick]);

  const checkedButtonOverrrideStyles = useMemo(
    () => ({
      rootChecked: { background: theme.palette.themePrimary, color: palette.white },
      label: screenShareButtonProps.checked ? { color: palette.white } : {}
    }),
    [screenShareButtonProps.checked, theme.palette.themePrimary]
  );

  const microphoneButton = options?.microphoneButton !== false && (
    <MicrophoneButton
      data-ui-id="call-composite-microphone-button"
      {...microphoneButtonProps}
      showLabel={!options?.compressedMode}
    />
  );

  const cameraButton = options?.cameraButton !== false && (
    <CameraButton
      data-ui-id="call-composite-camera-button"
      {...cameraButtonProps}
      showLabel={!options?.compressedMode}
    />
  );

  const screenShareButton = options?.screenShareButton !== false && (
    <ScreenShareButton
      data-ui-id="call-composite-screenshare-button"
      {...screenShareButtonProps}
      styles={checkedButtonOverrrideStyles}
      showLabel={!options?.compressedMode}
    />
  );

  const participantButton = options?.participantsButton !== false && (
    <ParticipantsButton
      data-ui-id="call-composite-participants-button"
      {...participantsButtonProps}
      showLabel={!options?.compressedMode}
      callInvitationURL={callInvitationURL}
      onFetchParticipantMenuItems={onFetchParticipantMenuItems}
    />
  );

  const optionsButton = options?.optionsButton !== false && (
    /* By setting `persistMenu?` to true, we prevent options menu from getting hidden every time a participant joins or leaves. */
    <OptionsButton persistMenu={true} {...optionsButtonProps} showLabel={!options?.compressedMode} />
  );

  const endCallButton = options?.endCallButton !== false && (
    <EndCallButton
      data-ui-id="call-composite-hangup-button"
      {...hangUpButtonProps}
      onHangUp={onHangUp}
      styles={!options?.compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
      showLabel={!options?.compressedMode}
    />
  );

  return (
    <ControlBar layout="dockedBottom">
      {microphoneButton}
      {cameraButton}
      {screenShareButton}
      {participantButton}
      {optionsButton}
      {endCallButton}
    </ControlBar>
  );
};
