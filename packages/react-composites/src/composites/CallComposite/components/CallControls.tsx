// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, mergeStyleSets, Stack } from '@fluentui/react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import {
  CameraButton,
  ControlBar,
  DevicesButton,
  EndCallButton,
  MicrophoneButton,
  ParticipantMenuItemsCallback,
  ParticipantsButton,
  ScreenShareButton
} from '@internal/react-components';
import React, { useMemo } from 'react';
import { useLocale } from '../../localization';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { getCallStatus, getLocalMicrophoneEnabled } from '../selectors/baseSelectors';
import {
  controlButtonBaseStyle,
  devicesButtonWithIncreasedTouchTargets,
  groupCallLeaveButtonCompressedStyle,
  groupCallLeaveButtonStyle,
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
   * Show or Hide Devices button during a call.
   * @defaultValue true
   */
  devicesButton?: boolean;
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

  const callStatus = useSelector(getCallStatus);
  const isLocalMicrophoneEnabled = useSelector(getLocalMicrophoneEnabled);
  const strings = useLocale().strings.call;

  /**
   * When call is in Lobby, microphone button should be disabled.
   * This is due to to headless limitation where a call can not be muted/unmuted in lobby.
   */
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  // We need to check for `callStatus` === 'None' as well since that's the first status of a call when
  // we join an ACS or Teams interop call. If we don't handle 'None', the microphone status won't reflect
  // the local microphone state when `callStatus` is 'None'.
  if (_isInLobbyOrConnecting(callStatus) || callStatus === 'None') {
    microphoneButtonProps.disabled = true;
    // Lobby page should show the microphone status that was set on the local preview/configuration
    // page until the user successfully joins the call.
    microphoneButtonProps.checked = isLocalMicrophoneEnabled;
  }
  const microphoneButtonStrings = _isInLobbyOrConnecting(callStatus)
    ? {
        strings: {
          tooltipOffContent: strings.microphoneToggleInLobbyNotAllowed,
          tooltipOnContent: strings.microphoneToggleInLobbyNotAllowed
        }
      }
    : {};

  const cameraButtonProps = usePropsFor(CameraButton);
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const participantsButtonProps = usePropsFor(ParticipantsButton);
  const devicesButtonProps = usePropsFor(DevicesButton);
  const hangUpButtonProps = usePropsFor(EndCallButton);

  const participantsButtonStyles = useMemo(
    () => mergeButtonBaseStyles(props.increaseFlyoutItemSize ? participantButtonWithIncreasedTouchTargets : {}),
    [props.increaseFlyoutItemSize]
  );

  const devicesButtonStyles = useMemo(
    () => mergeButtonBaseStyles(props.increaseFlyoutItemSize ? devicesButtonWithIncreasedTouchTargets : {}),
    [props.increaseFlyoutItemSize]
  );

  const compactMode = options?.displayType === 'compact';

  const microphoneButton = options?.microphoneButton !== false && (
    <MicrophoneButton
      data-ui-id="call-composite-microphone-button"
      {...microphoneButtonProps}
      showLabel={!compactMode}
      styles={controlButtonBaseStyle}
      {...microphoneButtonStrings}
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

  const devicesButton = options?.devicesButton !== false && (
    <DevicesButton
      /* By setting `persistMenu?` to true, we prevent options menu from getting hidden every time a participant joins or leaves. */
      persistMenu={true}
      {...devicesButtonProps}
      showLabel={!compactMode}
      styles={devicesButtonStyles}
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
          {devicesButton}
          {endCallButton}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const mergeButtonBaseStyles = (styles: IButtonStyles): IButtonStyles => mergeStyleSets(controlButtonBaseStyle, styles);
