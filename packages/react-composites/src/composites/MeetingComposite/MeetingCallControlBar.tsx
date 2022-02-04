// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { CallControlOptions, CallControls } from '../CallComposite/components/CallControls';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../CallComposite';
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
  callControls?: boolean | CallControlOptions
): CallControlOptions | false | undefined => {
  if (typeof callControls !== 'boolean') {
    callControls === undefined
      ? (callControls = { participantsButton: false })
      : (callControls.participantsButton = false);
    return callControls;
  }
  if (callControls === true) {
    // Return object with just participant button to false so that the default is that all the buttons will be present for meeting composite.
    return { participantsButton: false };
  }
  // callControls === false
  return false;
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
  let callControlOptions = inferCallControlOptions(props.callControls);

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
          <CallControls
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
              newMessageLabel={meetingStrings.newMessage}
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
