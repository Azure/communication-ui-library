// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, IButtonStyles, Stack } from '@fluentui/react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
/* @conditional-compile-remove-from(stable): custom button injection */
import { ControlBarButton } from '@internal/react-components';
import {
  BaseCustomStyles,
  CameraButton,
  ControlBar,
  ControlBarButtonStyles,
  DevicesButton,
  EndCallButton,
  ParticipantMenuItemsCallback,
  ParticipantsButton,
  ScreenShareButton
} from '@internal/react-components';
import React, { useMemo } from 'react';
import { usePropsFor } from '../hooks/usePropsFor';
import {
  controlButtonBaseStyle,
  devicesButtonWithIncreasedTouchTargets,
  groupCallLeaveButtonCompressedStyle,
  groupCallLeaveButtonStyle,
  participantButtonWithIncreasedTouchTargets
} from '../styles/CallControls.styles';
import {
  CallControlOptions,
  CustomCallControlButtonPlacement,
  CustomCallControlButtonProps
} from '../types/CallControlOptions';
import { Microphone } from './buttons/Microphone';

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
 * @private
 */
export const CallControls = (props: CallControlsProps): JSX.Element => {
  const { callInvitationURL, onFetchParticipantMenuItems } = props;
  const options = typeof props.options === 'boolean' ? {} : props.options;
  const compactMode = options?.displayType === 'compact';

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
    <Microphone
      displayType={options?.displayType}
      styles={commonButtonStyles}
      splitButtonsForDeviceSelection={props.splitButtonsForDeviceSelection}
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
