// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter, CallControlOptions, CustomCallControlButtonCallback } from '../CallComposite';
import { PeopleButton } from './PeopleButton';
import { concatStyleSets, IStyle, ITheme, mergeStyles, Stack, useTheme } from '@fluentui/react';
import { reduceCallControlsForMobile } from '../CallComposite/utils';
import { controlBarContainerStyles } from '../CallComposite/styles/CallControls.styles';
import { callControlsContainerStyles } from '../CallComposite/styles/CallPage.styles';
import { MeetingCallControlOptions } from './MeetingComposite';
import { useMeetingCompositeStrings } from './hooks/useMeetingCompositeStrings';
import { ChatAdapter } from '../ChatComposite';
import { ChatButtonWithUnreadMessagesBadge } from './ChatButtonWithUnreadMessagesBadge';
import { BaseCustomStyles, ControlBarButtonStyles } from '@internal/react-components';
import { generateCustomButtons } from '../CallComposite/components/buttons/Custom';
import { ControlBar } from '@internal/react-components';
import { Microphone } from '../CallComposite/components/buttons/Microphone';
import { Camera } from '../CallComposite/components/buttons/Camera';
import { ScreenShare } from '../CallComposite/components/buttons/ScreenShare';
import { Participants } from '../CallComposite/components/buttons/Participants';
import { Devices } from '../CallComposite/components/buttons/Devices';
import { EndCall } from '../CallComposite/components/buttons/EndCall';
import { ParticipantMenuItemsCallback } from '@internal/react-components';

/**
 * @private
 */
export interface MeetingCallControlBarProps {
  callAdapter: CallAdapter;
  chatButtonChecked: boolean;
  peopleButtonChecked: boolean;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  mobileView: boolean;
  disableButtonsForLobbyPage: boolean;
  callControls?: boolean | MeetingCallControlOptions;
  chatAdapter: ChatAdapter;
}

const inferMeetingCallControlOptions = (
  meetingControls?: boolean | MeetingCallControlOptions
): MeetingCallControlOptions | false | undefined => {
  if (typeof meetingControls !== 'boolean') {
    return meetingControls;
  }
  if (meetingControls === true) {
    // return empty object so buttons in the meetingCallControlOptions set render in their defualt behaviors.
    return undefined;
  }
  // callControls === false
  return false;
};

const inferCallControlOptions = (
  mobileView: boolean,
  callControls?: boolean | CallControlOptions
): CallControlOptions | false | undefined => {
  const callControlOverrides: Partial<CallControlOptions> = {
    // Participants button is shown separately on the side.
    participantsButton: false,
    // Device dropdowns are shown via split buttons.
    // TODO: Remove the devicesButton for mobile view as well once
    // the overflow button has been added for device selection.
    devicesButton: mobileView
  };
  if (callControls === false) {
    return false;
  }
  if (callControls === true) {
    return callControlOverrides;
  }
  callControls = callControls ?? {};
  return { ...callControls, ...callControlOverrides };
};

/**
 * @private
 */
export const MeetingCallControlBar = (props: MeetingCallControlBarProps): JSX.Element => {
  const theme = useTheme();
  console.log(theme);

  const meetingStrings = useMeetingCompositeStrings();
  // Set the desired control buttons from the meetings composite. particiapantsButton is always false since there is the peopleButton.
  const meetingCallControlOptions = inferMeetingCallControlOptions(props.callControls);
  let callControlOptions = inferCallControlOptions(props.mobileView, props.callControls);

  /**
   * Helper function to determine if a meeting control bar button is enabled or not.
   * @private
   */
  const isEnabled = (option: boolean | undefined): boolean => !(option === false);

  // Reduce the controls shown when mobile view is enabled.
  if (props.mobileView) {
    callControlOptions = reduceCallControlsForMobile(callControlOptions);
  }

  /**
   * Until mobile meetings is worked on, statically set the width of the
   * control bar such that all controls can be accessed.
   */
  const temporaryMeetingControlBarStyles = props.mobileView ? { width: '23.5rem' } : undefined;
  const desktopCommonButtonStyles = useMemo(() => getDesktopCommonButtonStyles(theme), [theme]);
  const desktopEndCallButtonStyles = useMemo(() => getDesktopEndCallButtonStyles(theme), [theme]);

  return (
    <Stack
      horizontal
      className={mergeStyles(temporaryMeetingControlBarStyles, callControlsContainerStyles, controlBarContainerStyles)}
    >
      <Stack.Item grow>
        <CallAdapterProvider adapter={props.callAdapter}>
          <XKCDCallControls
            options={callControlOptions}
            increaseFlyoutItemSize={props.mobileView}
            splitButtonsForDeviceSelection={!props.mobileView}
            controlBarStyles={!props.mobileView ? desktopControlBarStyles : undefined}
            commonButtonStyles={!props.mobileView ? desktopCommonButtonStyles : undefined}
            endCallButtonStyles={!props.mobileView ? desktopEndCallButtonStyles : undefined}
          />
        </CallAdapterProvider>
      </Stack.Item>
      {meetingCallControlOptions !== false && (
        <Stack horizontal className={!props.mobileView ? mergeStyles(desktopButtonContainerStyle) : undefined}>
          {isEnabled(meetingCallControlOptions?.peopleButton) !== false && (
            <PeopleButton
              checked={props.peopleButtonChecked}
              showLabel={true}
              onClick={props.onPeopleButtonClicked}
              data-ui-id="meeting-composite-people-button"
              disabled={props.disableButtonsForLobbyPage}
              label={meetingStrings.peopleButtonLabel}
              styles={!props.mobileView ? desktopCommonButtonStyles : undefined}
            />
          )}
          {isEnabled(meetingCallControlOptions?.chatButton) !== false && (
            <ChatButtonWithUnreadMessagesBadge
              chatAdapter={props.chatAdapter}
              checked={props.chatButtonChecked}
              showLabel={true}
              isChatPaneVisible={props.chatButtonChecked}
              onClick={props.onChatButtonClicked}
              disabled={props.disableButtonsForLobbyPage}
              label={meetingStrings.chatButtonLabel}
              styles={!props.mobileView ? desktopCommonButtonStyles : undefined}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};

const desktopButtonContainerStyle: IStyle = {
  padding: '0.75rem',
  columnGap: '0.5rem'
};

const desktopControlBarStyles: BaseCustomStyles = {
  root: desktopButtonContainerStyle
};

const getDesktopCommonButtonStyles = (theme: ITheme): ControlBarButtonStyles => ({
  root: {
    border: `solid 1px ${theme.palette.neutralQuaternaryAlt}`,
    borderRadius: theme.effects.roundedCorner4,
    minHeight: '2.5rem'
  },
  flexContainer: {
    flexFlow: 'row nowrap'
  },
  textContainer: {
    // Override the default so that label doesn't introduce a new block.
    display: 'inline'
  },
  label: {
    // Override styling from ControlBarButton so that label doesn't introduce a new block.
    display: 'inline',
    fontSize: theme.fonts.medium.fontSize
  },
  splitButtonMenuButton: {
    border: `solid 1px ${theme.palette.neutralQuaternaryAlt}`,
    borderRadius: theme.effects.roundedCorner4
  },
  splitButtonMenuButtonChecked: {
    // Default colors the menu half similarly for :hover and when button is checked.
    // To align with how the left-half is styled, override the checked style.
    background: 'none'
  }
});

const getDesktopEndCallButtonStyles = (theme: ITheme): ControlBarButtonStyles => {
  const overrides: ControlBarButtonStyles = {
    root: {
      // Suppress border around the dark-red button.
      border: 'none'
    }
  };
  return concatStyleSets(getDesktopCommonButtonStyles(theme), overrides);
};

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

const XKCDCallControls = (props: CallControlsProps): JSX.Element => {
  const options = typeof props.options === 'boolean' ? {} : props.options;
  const customButtons = useMemo(
    () => generateCustomButtons(onFetchCustomButtonPropsTrampoline(options), options?.displayType),
    [options]
  );

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
          {customButtons['first']}
          {options?.microphoneButton !== false && (
            <Microphone
              displayType={options?.displayType}
              styles={props.commonButtonStyles}
              splitButtonsForDeviceSelection={props.splitButtonsForDeviceSelection}
            />
          )}
          {customButtons['afterMicrophoneButton']}
          {options?.cameraButton !== false && (
            <Camera
              displayType={options?.displayType}
              styles={props.commonButtonStyles}
              splitButtonsForDeviceSelection={props.splitButtonsForDeviceSelection}
            />
          )}
          {customButtons['afterCameraButton']}
          {options?.screenShareButton !== false && (
            <ScreenShare
              option={options?.screenShareButton}
              displayType={options?.displayType}
              styles={props.commonButtonStyles}
            />
          )}
          {customButtons['afterScreenShareButton']}
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
          {customButtons['afterParticipantsButton']}
          {options?.devicesButton !== false && (
            <Devices
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
              styles={props.commonButtonStyles}
            />
          )}
          {customButtons['afterOptionsButton']}
          {options?.endCallButton !== false && (
            <EndCall displayType={options?.displayType} styles={props.endCallButtonStyles} />
          )}
          {customButtons['afterEndCallButton']}
          {customButtons['last']}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const onFetchCustomButtonPropsTrampoline = (
  options?: CallControlOptions
): CustomCallControlButtonCallback[] | undefined => {
  let response: CustomCallControlButtonCallback[] | undefined = undefined;
  /* @conditional-compile-remove-from(stable): custom button injection */
  response = options?.onFetchCustomButtonProps;
  return response;
};
