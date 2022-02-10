// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, IButtonStyles, Stack } from '@fluentui/react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
/* @conditional-compile-remove-from(stable): custom button injection */
import { ControlBarButton } from '@internal/react-components';
import {
  BaseCustomStyles,
  ControlBar,
  ControlBarButtonStyles,
  DevicesButton,
  EndCallButton,
  ParticipantMenuItemsCallback,
  ScreenShareButton
} from '@internal/react-components';
import React, { useMemo } from 'react';
import { usePropsFor } from '../hooks/usePropsFor';
import {
  controlButtonBaseStyle,
  devicesButtonWithIncreasedTouchTargets,
  groupCallLeaveButtonCompressedStyle,
  groupCallLeaveButtonStyle
} from '../styles/CallControls.styles';
import {
  CallControlOptions,
  CustomCallControlButtonPlacement,
  CustomCallControlButtonProps
} from '../types/CallControlOptions';
import { Camera } from './buttons/Camera';
import { Devices } from './buttons/Devices';
import { EndCall } from './buttons/EndCall';
import { Microphone } from './buttons/Microphone';
import { Participants } from './buttons/Participants';
import { ScreenShare } from './buttons/ScreenShare';

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
  const options = typeof props.options === 'boolean' ? {} : props.options;

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
          {options?.microphoneButton !== false && (
            <Microphone
              displayType={options?.displayType}
              styles={props.commonButtonStyles}
              splitButtonsForDeviceSelection={props.splitButtonsForDeviceSelection}
            />
          )}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterMicrophoneButton'} />
          }
          {options?.cameraButton !== false && (
            <Camera
              displayType={options?.displayType}
              styles={props.commonButtonStyles}
              splitButtonsForDeviceSelection={props.splitButtonsForDeviceSelection}
            />
          )}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterCameraButton'} />
          }
          {options?.screenShareButton !== false && (
            <ScreenShare
              option={options?.screenShareButton}
              displayType={options?.displayType}
              styles={props.commonButtonStyles}
            />
          )}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterScreenShareButton'} />
          }
          {options?.participantsButton !== false && (
            <Participants
              option={options?.participantsButton}
              callInvitationURL={props.callInvitationURL}
              onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
              styles={props.commonButtonStyles}
            />
          )}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterParticipantsButton'} />
          }
          {options?.devicesButton !== false && (
            <Devices
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
              styles={props.commonButtonStyles}
            />
          )}
          {
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'afterOptionsButton'} />
          }
          {options?.endCallButton !== false && (
            <EndCall displayType={options?.displayType} styles={props.endCallButtonStyles} />
          )}
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
