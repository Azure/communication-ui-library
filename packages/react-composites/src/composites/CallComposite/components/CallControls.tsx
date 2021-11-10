// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
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
import React, { useMemo } from 'react';
import { usePropsFor } from '../hooks/usePropsFor';
import {
  controlBarContainerStyles,
  checkedButtonOverrideStyles,
  groupCallLeaveButtonCompressedStyle,
  groupCallLeaveButtonStyle,
  optionsButtonWithIncreasedTouchTargets,
  participantButtonWithIncreasedTouchTargets
} from '../styles/CallControls.styles';

/**
 * @private
 */
export type CallControlsProps = {
  callInvitationURL?: string;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: boolean | CallControlOptions;
  /**
   * Option to increase the height of the button flyout menu items from 36px to 48px.
   * Recommended for mobile devices.
   */
  increaseFlyoutItemSize?: boolean;
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
   * Show or Hide Options button during a call.
   * @defaultValue true
   */
  optionsButton?: boolean;
  /**
   * Show, Hide or Disable participants button during a call.
   * @defaultValue true
   */
  participantsButton?: boolean | { disabled: boolean };
  /**
   * Show, Hide or Disable the screen share button during a call.
   * @defaultValue true
   */
  screenShareButton?: boolean | { disabled: boolean };
};

/**
 * @private
 */
export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { callInvitationURL, onFetchParticipantMenuItems } = props;

  const options = typeof props.options === 'boolean' ? {} : props.options;

  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const cameraButtonProps = usePropsFor(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const participantsButtonProps = usePropsFor(ParticipantsButton);
  const optionsButtonProps = usePropsFor(OptionsButton);
  const hangUpButtonProps = usePropsFor(EndCallButton);

  const theme = useTheme();

  const checkedScreenShareButtonOverrideStyles = useMemo(
    () => checkedButtonOverrideStyles(theme, screenShareButtonProps.checked),
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
      styles={checkedScreenShareButtonOverrideStyles}
      showLabel={!options?.compressedMode}
      disabled={options?.screenShareButton !== true && options?.screenShareButton?.disabled}
    />
  );

  const participantButton = options?.participantsButton !== false && (
    <ParticipantsButton
      data-ui-id="call-composite-participants-button"
      {...participantsButtonProps}
      showLabel={!options?.compressedMode}
      callInvitationURL={callInvitationURL}
      onFetchParticipantMenuItems={onFetchParticipantMenuItems}
      disabled={options?.participantsButton !== true && options?.participantsButton?.disabled}
      styles={props.increaseFlyoutItemSize ? participantButtonWithIncreasedTouchTargets : undefined}
    />
  );

  const optionsButton = options?.optionsButton !== false && (
    /* By setting `persistMenu?` to true, we prevent options menu from getting hidden every time a participant joins or leaves. */
    <OptionsButton
      persistMenu={true}
      {...optionsButtonProps}
      showLabel={!options?.compressedMode}
      styles={props.increaseFlyoutItemSize ? optionsButtonWithIncreasedTouchTargets : undefined}
    />
  );

  const endCallButton = options?.endCallButton !== false && (
    <EndCallButton
      data-ui-id="call-composite-hangup-button"
      {...hangUpButtonProps}
      styles={!options?.compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
      showLabel={!options?.compressedMode}
    />
  );

  return (
    <Stack styles={controlBarContainerStyles} horizontalAlign="center">
      <Stack.Item>
        <ControlBar layout="horizontal">
          {microphoneButton}
          {cameraButton}
          {screenShareButton}
          {participantButton}
          {optionsButton}
          {endCallButton}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};
