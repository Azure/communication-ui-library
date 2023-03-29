// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../CallComposite';
import { PeopleButton } from './PeopleButton';
import { concatStyleSets, IStyle, ITheme, mergeStyles, mergeStyleSets, Stack, useTheme } from '@fluentui/react';
import { controlBarContainerStyles } from '../CallComposite/styles/CallControls.styles';
import { callControlsContainerStyles } from '../CallComposite/styles/CallPage.styles';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { ChatAdapter } from '../ChatComposite';
import { ChatButtonWithUnreadMessagesBadge } from './ChatButtonWithUnreadMessagesBadge';
import { BaseCustomStyles, ControlBarButtonStyles } from '@internal/react-components';
import { ControlBar } from '@internal/react-components';
import { Microphone } from '../CallComposite/components/buttons/Microphone';
import { Camera } from '../CallComposite/components/buttons/Camera';
import { ScreenShare } from '../CallComposite/components/buttons/ScreenShare';
import { EndCall } from '../CallComposite/components/buttons/EndCall';
import { MoreButton } from '../common/MoreButton';
import { CallWithChatControlOptions } from './CallWithChatComposite';
import { ContainerRectProps } from '../common/ContainerRectProps';
/* @conditional-compile-remove(control-bar-button-injection) */
import {
  CUSTOM_BUTTON_OPTIONS,
  generateCustomCallWithChatControlBarButton,
  onFetchCustomButtonPropsTrampoline
} from './CustomButton';
/*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { DesktopMoreButton } from './components/DesktopMoreButton';
import { isDisabled } from '../CallComposite/utils';
import { HiddenFocusStartPoint } from '../common/HiddenFocusStartPoint';

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
  disableButtonsForHoldScreen?: boolean;
  /* @conditional-compile-remove(PSTN-calls) */
  onClickShowDialpad?: () => void;
  /* @conditional-compile-remove(video-background-effects) */
  onShowVideoEffectsPicker?: (showVideoEffectsOptions: boolean) => void;
  rtl?: boolean;
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
export const CallWithChatControlBar = (props: CallWithChatControlBarProps & ContainerRectProps): JSX.Element => {
  const theme = useTheme();
  const callWithChatStrings = useCallWithChatCompositeStrings();
  const options = inferCallWithChatControlOptions(props.mobileView, props.callControls);
  const chatButtonStrings = useMemo(
    () => ({
      label: callWithChatStrings.chatButtonLabel,
      tooltipOffContent: callWithChatStrings.chatButtonTooltipOpen,
      tooltipOnContent: callWithChatStrings.chatButtonTooltipClose
    }),
    [callWithChatStrings]
  );
  const peopleButtonStrings = useMemo(
    () => ({
      label: callWithChatStrings.peopleButtonLabel,
      tooltipOffContent: callWithChatStrings.peopleButtonTooltipOpen,
      tooltipOnContent: callWithChatStrings.peopleButtonTooltipClose
    }),
    [callWithChatStrings]
  );
  const moreButtonStrings = useMemo(
    () => ({
      label: callWithChatStrings.moreDrawerButtonLabel,
      tooltipContent: callWithChatStrings.moreDrawerButtonTooltip
    }),
    [callWithChatStrings]
  );

  const centerContainerStyles = useMemo(() => {
    const styles: BaseCustomStyles = !props.mobileView ? desktopControlBarStyles : {};
    return mergeStyleSets(styles, {
      root: {
        // Enforce a background color on control bar to ensure it matches the composite background color.
        background: theme.semanticColors.bodyBackground
      }
    });
  }, [props.mobileView, theme.semanticColors.bodyBackground]);
  const screenShareButtonStyles = useMemo(
    () => (!props.mobileView ? getDesktopScreenShareButtonStyles(theme) : undefined),
    [props.mobileView, theme]
  );
  const commonButtonStyles = useMemo(
    () => (!props.mobileView ? getDesktopCommonButtonStyles(theme) : undefined),
    [props.mobileView, theme]
  );
  const endCallButtonStyles = useMemo(
    () => (!props.mobileView ? getDesktopEndCallButtonStyles(theme) : undefined),
    [props.mobileView, theme]
  );

  const controlBarWrapperDesktopStyles: IStyle = useMemo(
    () => (!props.mobileView ? (props.rtl ? wrapperDesktopRtlStyles : wrapperDesktopStyles) : {}),
    [props.mobileView, props.rtl]
  );

  const controlBarDesktopContainerStyles: IStyle = useMemo(
    () => (!props.mobileView ? { position: 'relative' } : {}),
    [props.mobileView]
  );

  /* @conditional-compile-remove(control-bar-button-injection) */
  const customButtons = useMemo(
    () =>
      generateCustomCallWithChatControlBarButton(
        onFetchCustomButtonPropsTrampoline(options !== false ? options : undefined),
        options !== false ? options?.displayType : undefined
      ),
    [options]
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
      disabled={props.disableButtonsForLobbyPage || isDisabled(options.chatButton)}
      strings={chatButtonStrings}
      styles={commonButtonStyles}
      newMessageLabel={callWithChatStrings.chatButtonNewMessageNotificationLabel}
    />
  );

  return (
    <Stack
      horizontal
      reversed={!props.mobileView}
      horizontalAlign="space-between"
      className={mergeStyles(callControlsContainerStyles, controlBarContainerStyles, controlBarDesktopContainerStyles)}
    >
      <Stack.Item grow className={mergeStyles(controlBarWrapperDesktopStyles)}>
        <CallAdapterProvider adapter={props.callAdapter}>
          <Stack horizontalAlign="center">
            {/*
              HiddenFocusStartPoint is a util component used when we can't ensure the initial element for first
              tab focus is at the top of dom tree. It moves the first-tab focus to the next interact-able element
              immediately after it in the dom tree.
              */}
            <HiddenFocusStartPoint />
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
                    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
                    disabled={props.disableButtonsForHoldScreen || isDisabled(options.microphoneButton)}
                  />
                )}
                {isEnabled(options.cameraButton) && (
                  <Camera
                    displayType={options.displayType}
                    styles={commonButtonStyles}
                    splitButtonsForDeviceSelection={!props.mobileView}
                    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
                    disabled={props.disableButtonsForHoldScreen || isDisabled(options.cameraButton)}
                    /* @conditional-compile-remove(video-background-effects) */
                    onShowVideoEffectsPicker={props.onShowVideoEffectsPicker}
                  />
                )}
                {props.mobileView && isEnabled(options?.chatButton) && chatButton}
                {isEnabled(options.screenShareButton) && (
                  <ScreenShare
                    option={options.screenShareButton}
                    displayType={options.displayType}
                    styles={screenShareButtonStyles}
                    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
                    disabled={props.disableButtonsForHoldScreen || isDisabled(options.screenShareButton)}
                  />
                )}
                {
                  /* @conditional-compile-remove(control-bar-button-injection) */
                  customButtons['primary']
                    ?.slice(
                      0,
                      props.mobileView
                        ? CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_MOBILE_CUSTOM_BUTTONS
                        : CUSTOM_BUTTON_OPTIONS.MAX_PRIMARY_DESKTOP_CUSTOM_BUTTONS
                    )
                    .map((CustomButton, i) => {
                      return (
                        <CustomButton
                          key={`primary-custom-button-${i}`}
                          styles={commonButtonStyles}
                          showLabel={options.displayType !== 'compact'}
                        />
                      );
                    })
                }
                {props.mobileView && (
                  <MoreButton
                    data-ui-id="call-with-chat-composite-more-button"
                    strings={moreButtonStrings}
                    onClick={props.onMoreButtonClicked}
                    disabled={props.disableButtonsForLobbyPage}
                  />
                )}
                {
                  /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ isEnabled(
                    options?.moreButton
                  ) &&
                    /*@conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ isEnabled(
                      options?.holdButton
                    ) &&
                    !props.mobileView && (
                      <DesktopMoreButton
                        disableButtonsForHoldScreen={props.disableButtonsForHoldScreen}
                        styles={commonButtonStyles}
                        onClickShowDialpad={props.onClickShowDialpad}
                        /* @conditional-compile-remove(control-bar-button-injection) */
                        callControls={props.callControls}
                      />
                    )
                }
                <EndCall displayType="compact" styles={endCallButtonStyles} />
              </ControlBar>
            </Stack.Item>
          </Stack>
        </CallAdapterProvider>
      </Stack.Item>
      {!props.mobileView && (
        <Stack.Item>
          <Stack horizontal className={!props.mobileView ? mergeStyles(desktopButtonContainerStyle) : undefined}>
            {
              /* @conditional-compile-remove(control-bar-button-injection) */
              customButtons['secondary']
                ?.slice(0, CUSTOM_BUTTON_OPTIONS.MAX_SECONDARY_DESKTOP_CUSTOM_BUTTONS)
                .map((CustomButton, i) => {
                  return (
                    <CustomButton
                      key={`secondary-custom-button-${i}`}
                      styles={commonButtonStyles}
                      showLabel={options.displayType !== 'compact'}
                    />
                  );
                })
            }
            {isEnabled(options?.peopleButton) && (
              <PeopleButton
                checked={props.peopleButtonChecked}
                ariaLabel={peopleButtonStrings?.label}
                showLabel={options.displayType !== 'compact'}
                onClick={props.onPeopleButtonClicked}
                data-ui-id="call-with-chat-composite-people-button"
                disabled={props.disableButtonsForLobbyPage || isDisabled(options.peopleButton)}
                strings={peopleButtonStrings}
                styles={commonButtonStyles}
              />
            )}
            {isEnabled(options?.chatButton) && chatButton}
          </Stack>
        </Stack.Item>
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

{
  /*
    Styling here to ensure the control bar buttons stay in the center of the parent component (control Container) regardless of its siblings
    Need to add 'reversed' to parent container because the styling here reverse the position of the two stack items 
  */
}
const wrapperDesktopStyles: IStyle = {
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, 0)'
};

const wrapperDesktopRtlStyles: IStyle = {
  position: 'absolute',
  right: '50%',
  transform: 'translate(-50%, 0)'
};

const getDesktopCommonButtonStyles = (theme: ITheme): ControlBarButtonStyles => ({
  root: {
    border: `solid 1px ${theme.palette.neutralQuaternaryAlt}`,
    borderRadius: theme.effects.roundedCorner4,
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
    borderTopRightRadius: theme.effects.roundedCorner4,
    borderBottomRightRadius: theme.effects.roundedCorner4,
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0'
  },
  splitButtonMenuButtonChecked: {
    // Default colors the menu half similarly for :hover and when button is checked.
    // To align with how the left-half is styled, override the checked style.
    background: 'none'
  }
});

const getDesktopScreenShareButtonStyles = (theme: ITheme): ControlBarButtonStyles => {
  const overrideStyles = {
    border: 'none',
    background: theme.palette.themePrimary,
    color: theme.palette.white,
    '* > svg': { fill: theme.palette.white }
  };
  const overrides: ControlBarButtonStyles = {
    rootChecked: overrideStyles,
    rootCheckedHovered: overrideStyles
  };
  return concatStyleSets(getDesktopCommonButtonStyles(theme), overrides);
};

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
