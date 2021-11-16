// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, mergeStyleSets, Stack } from '@fluentui/react';
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
  checkedButtonOverrideStyles,
  controlButtonBaseStyle,
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
   * Options to change how the call controls are displayed.
   * `'compact'` display type will decreases the size of buttons and hide the labels.
   *
   * @remarks
   * If the composite `formFactor` is set to `'mobile'`, the control bar will always use compact view.
   *
   * @defaultValue 'default'
   */
  displayType?: 'default' | 'compact';
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

  const screenShareButtonStyles = useMemo(
    () => mergeButtonBaseStyles(checkedButtonOverrideStyles(theme, screenShareButtonProps.checked)),
    [screenShareButtonProps.checked, theme.palette.themePrimary]
  );

  const participantsButtonStyles = useMemo(
    () => mergeButtonBaseStyles(props.increaseFlyoutItemSize ? participantButtonWithIncreasedTouchTargets : {}),
    [props.increaseFlyoutItemSize]
  );

  const optionsButtonStyles = useMemo(
    () => mergeButtonBaseStyles(props.increaseFlyoutItemSize ? optionsButtonWithIncreasedTouchTargets : {}),
    [props.increaseFlyoutItemSize]
  );

  const compactMode = options?.displayType === 'compact';

  const microphoneButton = options?.microphoneButton !== false && (
    <MicrophoneButton
      data-ui-id="call-composite-microphone-button"
      {...microphoneButtonProps}
      showLabel={!compactMode}
      styles={controlButtonBaseStyle}
    />
  );

  const cameraButton = options?.cameraButton !== false && (
    <CameraButton
      data-ui-id="call-composite-camera-button"
      {...cameraButtonProps}
      showLabel={!compactMode}
      styles={controlButtonBaseStyle}
    />
  );

  const screenShareButton = options?.screenShareButton !== false && (
    <ScreenShareButton
      data-ui-id="call-composite-screenshare-button"
      {...screenShareButtonProps}
      styles={screenShareButtonStyles}
      showLabel={!compactMode}
      disabled={options?.screenShareButton !== true && options?.screenShareButton?.disabled}
    />
  );

  const participantButton = options?.participantsButton !== false && (
    <ParticipantsButton
      data-ui-id="call-composite-participants-button"
      {...participantsButtonProps}
      showLabel={!compactMode}
      callInvitationURL={callInvitationURL}
      onFetchParticipantMenuItems={onFetchParticipantMenuItems}
      disabled={options?.participantsButton !== true && options?.participantsButton?.disabled}
      styles={participantsButtonStyles}
    />
  );

  const optionsButton = options?.optionsButton !== false && (
    <OptionsButton
      /* By setting `persistMenu?` to true, we prevent options menu from getting hidden every time a participant joins or leaves. */
      persistMenu={true}
      {...optionsButtonProps}
      showLabel={!compactMode}
      styles={optionsButtonStyles}
    />
  );

  const endCallButton = options?.endCallButton !== false && (
    <EndCallButton
      data-ui-id="call-composite-hangup-button"
      {...hangUpButtonProps}
      styles={compactMode ? groupCallLeaveButtonCompressedStyle : groupCallLeaveButtonStyle}
      showLabel={!compactMode}
    />
  );

  return (
    <Stack horizontalAlign="center">
      <Stack.Item>
        {/*
            Note: We use the layout="horizontal" instead of dockedBottom because of how we position the
            control bar. The control bar exists in a Stack below the MediaGallery. The MediaGallery is
            set to grow and fill the remaining space not taken up by the ControlBar. If we were to use
            dockedBottom it has position absolute and would therefore float on top of the media gallery,
            occluding some of its content.
         */}
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

const mergeButtonBaseStyles = (styles: IButtonStyles): IButtonStyles => mergeStyleSets(controlButtonBaseStyle, styles);
