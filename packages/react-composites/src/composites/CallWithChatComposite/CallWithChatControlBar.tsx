// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../CallComposite';
import { PeopleButton } from './PeopleButton';
import { concatStyleSets, IStyle, ITheme, mergeStyles, Stack, useTheme } from '@fluentui/react';
import { controlBarContainerStyles } from '../CallComposite/styles/CallControls.styles';
import { callControlsContainerStyles } from '../CallComposite/styles/CallPage.styles';
import { CallWithChatControlOptions } from './CallWithChatComposite';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { ChatAdapter } from '../ChatComposite';
import { ChatButtonWithUnreadMessagesBadge } from './ChatButtonWithUnreadMessagesBadge';
import { BaseCustomStyles, ControlBarButtonStyles } from '@internal/react-components';
import { ControlBar } from '@internal/react-components';
import { Microphone } from '../CallComposite/components/buttons/Microphone';
import { Camera } from '../CallComposite/components/buttons/Camera';
import { ScreenShare } from '../CallComposite/components/buttons/ScreenShare';
import { EndCall } from '../CallComposite/components/buttons/EndCall';
import { MoreButton } from './MoreButton';

/**
 * @private
 */
export interface CallWithChatControlBarProps {
  callAdapter: CallAdapter;
  chatButtonChecked: boolean;
  peopleButtonChecked: boolean;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  onMoreButtonClicked: () => void;
  mobileView: boolean;
  disableButtonsForLobbyPage: boolean;
  callControls?: boolean | CallWithChatControlOptions;
  chatAdapter: ChatAdapter;
}

const inferCallWithChatControlOptions = (
  mobileView: boolean,
  callWithChatControls?: boolean | CallWithChatControlOptions
): CallWithChatControlOptions | false => {
  if (callWithChatControls === false) {
    return false;
  }

  const options = callWithChatControls === true || callWithChatControls === undefined ? {} : callWithChatControls;
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
export const CallWithChatControlBar = (props: CallWithChatControlBarProps): JSX.Element => {
  const theme = useTheme();
  const callWithChatStrings = useCallWithChatCompositeStrings();
  const options = inferCallWithChatControlOptions(props.mobileView, props.callControls);
  const chatButtonStrings = {
    label: callWithChatStrings.chatButtonLabel,
    tooltipOffContent: callWithChatStrings.chatButtonTooltipContentOpen,
    tooltipOnContent: callWithChatStrings.chatButtonTooltipContentClose
  };
  const peopleButtonStrings = {
    label: callWithChatStrings.peopleButtonLabel,
    tooltipOffContent: callWithChatStrings.peopleButtonTooltipContentOpen,
    tooltipOnContent: callWithChatStrings.peopleButtonTooltipContentClose
  };

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

  const chatButton = (
    <ChatButtonWithUnreadMessagesBadge
      chatAdapter={props.chatAdapter}
      checked={props.chatButtonChecked}
      showLabel={options.displayType !== 'compact'}
      isChatPaneVisible={props.chatButtonChecked}
      onClick={props.onChatButtonClicked}
      disabled={props.disableButtonsForLobbyPage}
      strings={chatButtonStrings}
      styles={commonButtonStyles}
      newMessageLabel={callWithChatStrings.chatButtonNewMessageNotificationLabel}
    />
  );

  return (
    <Stack horizontal className={mergeStyles(callControlsContainerStyles, controlBarContainerStyles)}>
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
                    splitButtonsForDeviceSelection={!props.mobileView}
                  />
                )}
                {isEnabled(options.cameraButton) && (
                  <Camera
                    displayType={options.displayType}
                    styles={commonButtonStyles}
                    splitButtonsForDeviceSelection={!props.mobileView}
                  />
                )}
                {props.mobileView && isEnabled(options?.chatButton) && chatButton}
                {isEnabled(options.screenShareButton) && (
                  <ScreenShare
                    option={options.screenShareButton}
                    displayType={options.displayType}
                    styles={commonButtonStyles}
                  />
                )}
                {props.mobileView && (
                  <MoreButton
                    data-ui-id="call-with-chat-composite-more-button"
                    ariaLabel={callWithChatStrings.moreDrawerButtonLabel}
                    onClick={props.onMoreButtonClicked}
                  />
                )}
                <EndCall displayType="compact" styles={endCallButtonStyles} />
              </ControlBar>
            </Stack.Item>
          </Stack>
        </CallAdapterProvider>
      </Stack.Item>
      {!props.mobileView && (
        <Stack horizontal className={!props.mobileView ? mergeStyles(desktopButtonContainerStyle) : undefined}>
          {isEnabled(options?.peopleButton) && (
            <PeopleButton
              checked={props.peopleButtonChecked}
              showLabel={true}
              onClick={props.onPeopleButtonClicked}
              data-ui-id="call-with-chat-composite-people-button"
              disabled={props.disableButtonsForLobbyPage}
              strings={peopleButtonStrings}
              styles={commonButtonStyles}
            />
          )}
          {isEnabled(options?.chatButton) && chatButton}
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
    borderRadius: theme.effects.roundedCorner2,
    minHeight: '2.5rem',
    maxWidth: '12rem' // allot extra space than the regular ControlBarButton. This is to give extra room to have the icon beside the text.
  },
  flexContainer: {
    display: 'flex',
    flexFlow: 'row nowrap'
  },
  textContainer: {
    // Override the default so that label doesn't introduce a new block.
    display: 'inline',

    // Ensure width is set to permit child to show ellipsis when there is a label that is too long
    maxWidth: '100%'
  },
  label: {
    fontSize: theme.fonts.medium.fontSize,

    // Ensure there is enough space between the icon and text to allow for the unread messages badge in the chat button
    marginLeft: '0.625rem',

    // Ensure letters that go above and below the standard text line like 'g', 'y', 'j' are not clipped
    lineHeight: '1.5rem',

    // Do not allow very long button texts to ruin the control bar experience, instead ensure long text is truncated and shows ellipsis
    display: 'block',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  splitButtonMenuButton: {
    border: `solid 1px ${theme.palette.neutralQuaternaryAlt}`,
    borderRadius: theme.effects.roundedCorner2,
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0'
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

const isEnabled = (option: unknown): boolean => option !== false;
