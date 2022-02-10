// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../CallComposite';
import { PeopleButton } from './PeopleButton';
import { concatStyleSets, IStyle, ITheme, mergeStyles, Stack, useTheme } from '@fluentui/react';
import { controlBarContainerStyles } from '../CallComposite/styles/CallControls.styles';
import { callControlsContainerStyles } from '../CallComposite/styles/CallPage.styles';
import { MeetingCallControlOptions } from './MeetingComposite';
import { useMeetingCompositeStrings } from './hooks/useMeetingCompositeStrings';
import { ChatAdapter } from '../ChatComposite';
import { ChatButtonWithUnreadMessagesBadge } from './ChatButtonWithUnreadMessagesBadge';
import { BaseCustomStyles, ControlBarButtonStyles } from '@internal/react-components';
import { ControlBar } from '@internal/react-components';
import { Microphone } from '../CallComposite/components/buttons/Microphone';
import { Camera } from '../CallComposite/components/buttons/Camera';
import { ScreenShare } from '../CallComposite/components/buttons/ScreenShare';
import { Participants } from '../CallComposite/components/buttons/Participants';
import { Devices } from '../CallComposite/components/buttons/Devices';
import { EndCall } from '../CallComposite/components/buttons/EndCall';

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
  mobileView: boolean,
  meetingControls?: boolean | MeetingCallControlOptions
): MeetingCallControlOptions | false => {
  if (meetingControls === false) {
    return false;
  }

  const options = meetingControls === true || meetingControls === undefined ? {} : meetingControls;
  if (mobileView) {
    // Set to compressed mode when composite is optimized for mobile
    options.displayType = 'compact';
    // Do not show screen share button when composite is optimized for mobile unless the developer
    // has explicitly opted in.
    if (options.screenShareButton !== true) {
      options.screenShareButton = false;
    }
  }
  return options;
};

/**
 * @private
 */
export const MeetingCallControlBar = (props: MeetingCallControlBarProps): JSX.Element => {
  const theme = useTheme();
  const meetingStrings = useMeetingCompositeStrings();
  const options = inferMeetingCallControlOptions(props.mobileView, props.callControls);

  /**
   * Until mobile meetings is worked on, statically set the width of the
   * control bar such that all controls can be accessed.
   */
  const temporaryMeetingControlBarStyles = props.mobileView ? { width: '23.5rem' } : undefined;
  const centerContainerStyles = useMemo(
    () => (!props.mobileView ? desktopControlBarStyles : undefined),
    [props.mobileView]
  );
  const commonButtonStyles = useMemo(
    () => (!props.mobileView ? getDesktopCommonButtonStyles(theme) : undefined),
    [props.mobileView, theme]
  );
  const endCallButtonStyles = useMemo(
    () => (!props.mobileView ? getDesktopEndCallButtonStyles(theme) : undefined),
    [props.mobileView, theme]
  );

  // when options is false then we want to hide the whole control bar.
  if (options === false) {
    return <></>;
  }

  return (
    <Stack
      horizontal
      className={mergeStyles(temporaryMeetingControlBarStyles, callControlsContainerStyles, controlBarContainerStyles)}
    >
      <Stack.Item grow>
        <CallAdapterProvider adapter={props.callAdapter}>
          <Stack horizontalAlign="center">
            <Stack.Item>
              {/*
                  Note: We use the layout="horizontal" instead of dockedBottom because of how we position the
                  control bar. The control bar exists in a Stack below the MediaGallery. The MediaGallery is
                  set to grow and fill the remaining space not taken up by the ControlBar. If we were to use
                  dockedBottom it has position absolute and would therefore float on top of the media gallery,
                  occluding some of its content.
                */}
              <ControlBar layout="horizontal" styles={centerContainerStyles}>
                {isEnabled(options.microphoneButton) && (
                  <Microphone
                    displayType={options.displayType}
                    styles={commonButtonStyles}
                    splitButtonsForDeviceSelection
                  />
                )}
                {options.cameraButton !== false && (
                  <Camera
                    displayType={options.displayType}
                    styles={commonButtonStyles}
                    splitButtonsForDeviceSelection
                  />
                )}
                {options.screenShareButton !== false && (
                  <ScreenShare
                    option={options.screenShareButton}
                    displayType={options.displayType}
                    styles={commonButtonStyles}
                  />
                )}
                <Participants
                  displayType={options.displayType}
                  increaseFlyoutItemSize={props.mobileView}
                  styles={commonButtonStyles}
                />
                {
                  // Device dropdowns are shown via split buttons.
                  // TODO: Remove the devicesButton for mobile view as well once
                  // the overflow button has been added for device selection.
                  props.mobileView && (
                    <Devices
                      displayType={options.displayType}
                      increaseFlyoutItemSize={props.mobileView}
                      styles={commonButtonStyles}
                    />
                  )
                }
                <EndCall displayType={options.displayType} styles={endCallButtonStyles} />
              </ControlBar>
            </Stack.Item>
          </Stack>
        </CallAdapterProvider>
      </Stack.Item>
      <Stack horizontal className={!props.mobileView ? mergeStyles(desktopButtonContainerStyle) : undefined}>
        {isEnabled(options?.peopleButton) !== false && (
          <PeopleButton
            checked={props.peopleButtonChecked}
            showLabel={true}
            onClick={props.onPeopleButtonClicked}
            data-ui-id="meeting-composite-people-button"
            disabled={props.disableButtonsForLobbyPage}
            label={meetingStrings.peopleButtonLabel}
            styles={commonButtonStyles}
          />
        )}
        {isEnabled(options?.chatButton) !== false && (
          <ChatButtonWithUnreadMessagesBadge
            chatAdapter={props.chatAdapter}
            checked={props.chatButtonChecked}
            showLabel={true}
            isChatPaneVisible={props.chatButtonChecked}
            onClick={props.onChatButtonClicked}
            disabled={props.disableButtonsForLobbyPage}
            label={meetingStrings.chatButtonLabel}
            styles={commonButtonStyles}
          />
        )}
      </Stack>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEnabled = (option: any): boolean => option !== false;
