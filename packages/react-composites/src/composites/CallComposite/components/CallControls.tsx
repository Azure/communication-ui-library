// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, IButtonStyles, Stack } from '@fluentui/react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
/* @conditional-compile-remove-from(stable): custom button injection */
import { ControlBarButton, ControlBarButtonProps } from '@internal/react-components';
import {
  BaseCustomStyles,
  CameraButton,
  ControlBar,
  ControlBarButtonStyles,
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
  /**
   * Whether to use split buttons to show device selection drop-downs
   * Used by {@link MeetingComposite}.
   */
  splitButtonsForDeviceSelection?: boolean;
  /**
   * Styles for the {@link ControlBar}.
   */
  controlBarStyles?: BaseCustomStyles;
  /**
   * Styles for all buttons except {@link EndCallButton}.
   */
  commonButtonStyles?: ControlBarButtonStyles;
  /**
   * Styles for {@link EndCallButton}.
   */
  endCallButtonStyles?: ControlBarButtonStyles;
};

/**
 * Control bar display type for {@link CallComposite}.
 *
 * @public
 */
export type CallControlDisplayType = 'default' | 'compact';

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
  displayType?: CallControlDisplayType;
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
  /* @conditional-compile-remove-from(stable): custom button injection */
  /**
   * Inject custom buttons in the call controls.
   *
   * @beta
   */
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[];
};

/* @conditional-compile-remove-from(stable): custom button injection */
/**
 * Placement for a custom button injected in the {@link CallControls}.
 *
 * 'first': Place the button on the left end (right end in rtl mode).
 * 'afterCameraButton': Place the button on the right (left in rtl mode) of the camera button.
 * ... and so on.
 *
 * It is an error to place the button in reference to another button that has
 * been hidden via a {@link CallControlOptions} field.
 *
 * Multiple buttons placed in the same position are appended in order.
 * E.g., if two buttons are placed 'first', they'll both appear on the left end (right end in rtl mode)
 * in the order provided.
 *
 * @beta
 */
export type CustomCallControlButtonPlacement =
  | 'first'
  | 'last'
  | 'afterCameraButton'
  | 'afterEndCallButton'
  | 'afterMicrophoneButton'
  | 'afterOptionsButton'
  | 'afterParticipantsButton'
  | 'afterScreenShareButton';

/* @conditional-compile-remove-from(stable): custom button injection */
/**
 * A callback that returns the props to render a custom {@link ControlBarButton}.
 *
 * The response indicates where the custom button should be placed.
 *
 * Performance tip: This callback is only called when either the callback or its arguments change.
 *
 * @beta
 */
export type CustomCallControlButtonCallback = (
  args: CustomCallControlButtonCallbackArgs
) => CustomCallControlButtonProps;

/* @conditional-compile-remove-from(stable): custom button injection */
/**
 * Arguments for {@link CustomCallControlButtonCallback}.
 *
 * @beta
 */
export interface CustomCallControlButtonCallbackArgs {
  /**
   * Buttons should reduce the size to fit a smaller viewport when `displayType` is `'compact'`.
   *
   * @defaultValue `'default'`
   */
  displayType?: CallControlDisplayType;
}

/* @conditional-compile-remove-from(stable): custom button injection */
/**
 * Response from {@link CustomCallControlButtonCallback}.
 *
 * Includes the props necessary to render a {@link  ControlBarButton} and indication of where to place the button.
 *
 * @beta
 */
export interface CustomCallControlButtonProps extends ControlBarButtonProps {
  /**
   * Where to place the custom button relative to other buttons.
   */
  placement: CustomCallControlButtonPlacement;
}

/**
 * @private
 */
export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { callInvitationURL, onFetchParticipantMenuItems } = props;
  const options = typeof props.options === 'boolean' ? {} : props.options;
  const compactMode = options?.displayType === 'compact';

  const callStatus = useSelector(getCallStatus);
  const isLocalMicrophoneEnabled = useSelector(getLocalMicrophoneEnabled);
  const strings = useLocale().strings.call;

  /**
   * When call is in Lobby, microphone button should be disabled.
   * This is due to to headless limitation where a call can not be muted/unmuted in lobby.
   */
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  if (_isInLobbyOrConnecting(callStatus)) {
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

  const commonButtonStyles = useMemo(
    () => concatButtonBaseStyles(props.commonButtonStyles ?? {}),
    [props.commonButtonStyles]
  );
  const participantsButtonStyles = useMemo(
    () =>
      concatButtonBaseStyles(
        props.increaseFlyoutItemSize ? participantButtonWithIncreasedTouchTargets : {},
        props.commonButtonStyles ?? {}
      ),
    [props.increaseFlyoutItemSize, props.commonButtonStyles]
  );
  const devicesButtonStyles = useMemo(
    () =>
      concatButtonBaseStyles(
        props.increaseFlyoutItemSize ? devicesButtonWithIncreasedTouchTargets : {},
        props.commonButtonStyles ?? {}
      ),
    [props.increaseFlyoutItemSize, props.commonButtonStyles]
  );
  const endCallButtonStyles = useMemo(
    () =>
      concatStyleSets(
        compactMode ? groupCallLeaveButtonCompressedStyle : groupCallLeaveButtonStyle,
        props.endCallButtonStyles ?? {}
      ),
    [props.endCallButtonStyles]
  );

  /* @conditional-compile-remove-from(stable): custom button injection */
  const customButtonProps = useMemo(() => {
    if (!options || !options.onFetchCustomButtonProps) {
      return [];
    }
    return options.onFetchCustomButtonProps.map((f) => f({ displayType: options.displayType }));
  }, [options?.onFetchCustomButtonProps, options?.displayType]);

  // when props.options is false then we want to hide the whole control bar.
  if (props.options === false) {
    return <></>;
  }

  const microphoneButton = options?.microphoneButton !== false && (
    // tab focus on MicrophoneButton on page load
    <MicrophoneButton
      autoFocus
      data-ui-id="call-composite-microphone-button"
      {...microphoneButtonProps}
      showLabel={!compactMode}
      styles={commonButtonStyles}
      {...microphoneButtonStrings}
      /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
      enableDeviceSelectionMenu={props.splitButtonsForDeviceSelection}
    />
  );

  const cameraButton = options?.cameraButton !== false && (
    <CameraButton
      data-ui-id="call-composite-camera-button"
      {...cameraButtonProps}
      showLabel={!compactMode}
      styles={commonButtonStyles}
      /* @conditional-compile-remove-from(stable) meeting-composite control-bar-split-buttons */
      enableDeviceSelectionMenu={props.splitButtonsForDeviceSelection}
    />
  );

  const screenShareButton = options?.screenShareButton !== false && (
    <ScreenShareButton
      data-ui-id="call-composite-screenshare-button"
      {...screenShareButtonProps}
      showLabel={!compactMode}
      disabled={options?.screenShareButton !== true && options?.screenShareButton?.disabled}
      styles={commonButtonStyles}
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
      styles={endCallButtonStyles}
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
        <ControlBar layout="horizontal" styles={props.controlBarStyles}>
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'first'} />
          }
          {microphoneButton}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterMicrophoneButton'} />
          }
          {cameraButton}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterCameraButton'} />
          }
          {screenShareButton}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterScreenShareButton'} />
          }
          {participantButton}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterParticipantsButton'} />
          }
          {devicesButton}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterOptionsButton'} />
          }
          {endCallButton}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterEndCallButton'} />
          }
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'last'} />
          }
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const concatButtonBaseStyles = (...styles: IButtonStyles[]): IButtonStyles => {
  let result = controlButtonBaseStyle;
  styles.forEach((style) => {
    result = concatStyleSets(result, style);
  });
  return result;
};

/* @conditional-compile-remove-from(stable): custom button injection */
const FilteredCustomButtons = (props: {
  customButtonProps: CustomCallControlButtonProps[];
  placement: CustomCallControlButtonPlacement;
}): JSX.Element => {
  return (
    <>
      {props.customButtonProps
        .filter((buttonProps) => buttonProps.placement === props.placement)
        .map((buttonProps, i) => (
          <ControlBarButton {...buttonProps} key={`${buttonProps.placement}_${i}`} />
        ))}
    </>
  );
};
