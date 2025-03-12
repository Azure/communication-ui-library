// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { mergeStyles, PartialTheme, Stack, Theme } from '@fluentui/react';
/* @conditional-compile-remove(breakout-rooms) */
import { Spinner, SpinnerSize } from '@fluentui/react';
import { CallCompositePage } from '../CallComposite';
import { CallSurvey } from '@azure/communication-calling';
import { CallState } from '@azure/communication-calling';
import { callCompositeContainerStyles, compositeOuterContainerStyles } from './styles/CallWithChatCompositeStyles';
/* @conditional-compile-remove(breakout-rooms) */
import { chatSpinnerContainerStyles } from './styles/CallWithChatCompositeStyles';
import { CallWithChatAdapter } from './adapter/CallWithChatAdapter';
import { CallWithChatBackedCallAdapter } from './adapter/CallWithChatBackedCallAdapter';
import { CallWithChatBackedChatAdapter } from './adapter/CallWithChatBackedChatAdapter';
import { CallAdapter } from '../CallComposite';
import { ChatComposite, ChatAdapter, ChatCompositeOptions } from '../ChatComposite';
import { BaseProvider, BaseCompositeProps } from '../common/BaseComposite';
import { CallWithChatCompositeIcons } from '../common/icons';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { CallWithChatAdapterState } from './state/CallWithChatAdapterState';
import { CallSurveyImprovementSuggestions } from '@internal/react-components';
import {
  ParticipantMenuItemsCallback,
  _useContainerHeight,
  _useContainerWidth,
  useTheme
} from '@internal/react-components';
import { useId } from '@fluentui/react-hooks';
import { containerDivStyles } from '../common/ContainerRectProps';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { CallCompositeInner, CallCompositeOptions } from '../CallComposite/CallComposite';
import { RemoteVideoTileMenuOptions } from '../CallComposite/CallComposite';
import { LocalVideoTileOptions } from '../CallComposite/CallComposite';
/* @conditional-compile-remove(call-readiness) */
import { DeviceCheckOptions } from '../CallComposite/CallComposite';
import { CommonCallControlOptions } from '../common/types/CommonCallControlOptions';
import { ChatButtonWithUnreadMessagesBadge } from './ChatButton/ChatButtonWithUnreadMessagesBadge';
import { getDesktopCommonButtonStyles } from '../common/ControlBar/CommonCallControlBar';
import { InjectedSidePaneProps } from '../CallComposite/components/SidePane/SidePaneProvider';
import { isDisabled } from '../CallComposite/utils';
import {
  CustomCallControlButtonCallback,
  CustomCallControlButtonCallbackArgs
} from '../common/ControlBar/CustomButton';
import { SidePaneHeader } from '../common/SidePaneHeader';
import { CallControlOptions } from '../CallComposite/types/CallControlOptions';
import { useUnreadMessagesTracker } from './ChatButton/useUnreadMessagesTracker';
import { VideoGalleryLayout } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentOptions } from '@internal/react-components';
/* @conditional-compile-remove(breakout-rooms) */
import { useLocale } from '../localization';

/**
 * Props required for the {@link CallWithChatComposite}
 *
 * @public
 */
export interface CallWithChatCompositeProps extends BaseCompositeProps<CallWithChatCompositeIcons> {
  adapter: CallWithChatAdapter;
  /**
   * Fluent theme for the composite.
   *
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Optimizes the composite form factor for either desktop or mobile.
   * @remarks `mobile` is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue 'desktop'
   */
  formFactor?: 'desktop' | 'mobile';
  /**
   * URL that can be used to copy a call-with-chat invite to the Users clipboard.
   */
  joinInvitationURL?: string;
  /**
   * Flags to enable/disable or customize UI elements of the {@link CallWithChatComposite}
   */
  options?: CallWithChatCompositeOptions;
}

/**
 * Customization options for the control bar in calling with chat experience.
 *
 * @public
 */
export interface CallWithChatControlOptions extends CommonCallControlOptions {
  /**
   * Show or hide the chat button in the call-with-chat composite control bar.
   * @defaultValue true
   */
  chatButton?: boolean | { disabled: boolean };
}

/**
 * Optional features of the {@link CallWithChatComposite}.
 *
 * @public
 */
export type CallWithChatCompositeOptions = {
  /**
   * Call control options to change what buttons show on the call-with-chat composite control bar.
   * If using the boolean values, true will cause default behavior across the whole control bar. False hides the whole control bar.
   */
  callControls?: boolean | CallWithChatControlOptions;
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Properties for configuring the File Sharing feature.
   * If undefined, file sharing feature will be disabled.
   * @beta
   */
  attachmentOptions?: AttachmentOptions;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Device permissions check options for your call.
   * Here you can choose what device permissions you prompt the user for,
   * as well as what device permissions must be accepted before starting a call.
   */
  deviceChecks?: DeviceCheckOptions;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Callback you may provide to supply users with further steps to troubleshoot why they have been
   * unable to grant your site the required permissions for the call.
   *
   * @example
   * ```ts
   * onPermissionsTroubleshootingClick: () =>
   *  window.open('https://contoso.com/permissions-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'further troubleshooting' link.
   */
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Optional callback to supply users with further troubleshooting steps for network issues
   * experienced when connecting to a call.
   *
   * @example
   * ```ts
   * onNetworkingTroubleShootingClick?: () =>
   *  window.open('https://contoso.com/network-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'network troubleshooting' link.
   */
  onNetworkingTroubleShootingClick?: () => void;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * Callback you may provide to supply users with a provided page to showcase supported browsers by ACS.
   *
   * @example
   * ```ts
   * onBrowserTroubleShootingClick?: () =>
   *  window.open('https://contoso.com/browser-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a unsupported browser page.
   */
  onEnvironmentInfoTroubleshootingClick?: () => void;
  /**
   * Remote participant video tile menu options
   */
  remoteVideoTileMenuOptions?: RemoteVideoTileMenuOptions;
  /**
   * Options for controlling the local video tile.
   *
   * @remarks if 'false' the local video tile will not be rendered.
   */
  localVideoTile?: boolean | LocalVideoTileOptions;
  /**
   * Options for controlling the starting layout of the composite's video gallery
   */
  galleryOptions?: {
    /**
     * Layout for the gallery when the call starts
     */
    layout?: VideoGalleryLayout;
  };
  /**
   * Options for end of call survey
   */
  surveyOptions?: {
    /**
     * Disable call survey at the end of a call.
     * @defaultValue false
     */
    disableSurvey?: boolean;
    /**
     * Optional callback to redirect users to custom screens when survey is done, note that default end call screen will be shown if this callback is not provided
     * This callback can be used to redirect users to different screens depending on survey state, whether it is submitted, skipped or has a problem when submitting the survey
     */
    onSurveyClosed?: (surveyState: 'sent' | 'skipped' | 'error', surveyError?: string) => void;
    /**
     * Optional callback to handle survey data including free form text response
     * Note that free form text response survey option is only going to be enabled when this callback is provided
     * User will need to handle all free form text response on their own
     */
    onSurveySubmitted?: (
      callId: string,
      surveyId: string,
      /**
       * This is the survey results containing star survey data and API tag survey data.
       * This part of the result will always be sent to the calling sdk
       * This callback provides user with the ability to gain access to survey data
       */
      submittedSurvey: CallSurvey,
      /**
       * This is the survey results containing free form text
       * This part of the result will not be handled by composites
       * User will need to collect and handle this information 100% on their own
       * Free form text survey is not going to show in the UI if onSurveySubmitted is not populated
       */
      improvementSuggestions: CallSurveyImprovementSuggestions
    ) => Promise<void>;
  };
  /**
   * Options for setting additional customizations related to personalized branding.
   */
  branding?: {
    /**
     * Logo displayed on the configuration page.
     */
    logo?: {
      /**
       * URL for the logo image.
       *
       * @remarks
       * Recommended size is 80x80 pixels.
       */
      url: string;
      /**
       * Alt text for the logo image.
       */
      alt?: string;
      /**
       * The logo can be displayed as a circle.
       *
       * @defaultValue 'unset'
       */
      shape?: 'unset' | 'circle';
    };
    /**
     * Background image displayed on the configuration page.
     */
    backgroundImage?: {
      /**
       * URL for the background image.
       *
       * @remarks
       * Background image should be larger than 576x567 pixels and smaller than 2048x2048 pixels pixels.
       */
      url: string;
    };
  };
  /**
   * Options for settings related to spotlight.
   */
  spotlight?: {
    /**
     * Flag to hide the menu buttons to start and stop spotlight for remote participants and the local participant.
     * @defaultValue false
     */
    hideSpotlightButtons?: boolean;
  };

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  /**
   * Enables rich text editor for the send and edit boxes
   * @defaultValue `false`
   *
   * @beta
   */
  richTextEditor?: boolean;
  /**
   * Options for settings related to joining a call.
   */
  joinCallOptions?: {
    /**
     * options for checking microphone permissions when joining a call.
     * block on access will block the user from joining the call if the microphone permission is not granted.
     * skip will allow the user to join the call without granting the microphone permission.
     * @defaultValue 'requireMicrophoneAvailable'
     */
    microphoneCheck?: 'requireMicrophoneAvailable' | 'skip';
  };
  /**
   * Options for hiding the local screen share stream
   * @defaultValue false
   */
  hideLocalScreenShareStream?: boolean;
};

type CallWithChatScreenProps = {
  callWithChatAdapter: CallWithChatAdapter;
  fluentTheme?: PartialTheme | Theme;
  formFactor?: 'desktop' | 'mobile';
  joinInvitationURL?: string;
  callControls?: boolean | CallWithChatControlOptions;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  /* @conditional-compile-remove(file-sharing-acs) */
  attachmentOptions?: AttachmentOptions;
  rtl?: boolean;
  /* @conditional-compile-remove(call-readiness) */
  deviceChecks?: DeviceCheckOptions;
  /* @conditional-compile-remove(call-readiness) */
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
  /* @conditional-compile-remove(call-readiness) */
  onNetworkingTroubleShootingClick?: () => void;
  /* @conditional-compile-remove(unsupported-browser) */
  onEnvironmentInfoTroubleshootingClick?: () => void;
  remoteVideoTileMenuOptions?: RemoteVideoTileMenuOptions;
  localVideoTile?: boolean | LocalVideoTileOptions;
  galleryOptions?: {
    layout?: VideoGalleryLayout;
  };
  /**
   * Options for end of call survey
   */
  surveyOptions?: {
    /**
     * Disable call survey at the end of a call.
     * @defaultValue false
     */
    disableSurvey?: boolean;
    /**
     * Optional callback to redirect users to custom screens when survey is done, note that default end call screen will be shown if this callback is not provided
     * This callback can be used to redirect users to different screens depending on survey state, whether it is submitted, skipped or has a problem when submitting the survey
     */
    onSurveyClosed?: (surveyState: 'sent' | 'skipped' | 'error', surveyError?: string) => void;
    /**
     * Optional callback to handle survey data including free form text response
     * Note that free form text response survey option is only going to be enabled when this callback is provided
     * User will need to handle all free form text response on their own
     */
    onSurveySubmitted?: (
      callId: string,
      surveyId: string,
      /**
       * This is the survey results containing star survey data and API tag survey data.
       * This part of the result will always be sent to the calling sdk
       * This callback provides user with the ability to gain access to survey data
       */
      submittedSurvey: CallSurvey,
      /**
       * This is the survey results containing free form text
       * This part of the result will not be handled by composites
       * User will need to collect and handle this information 100% on their own
       * Free form text survey is not going to show in the UI if onSurveySubmitted is not populated
       */
      improvementSuggestions: CallSurveyImprovementSuggestions
    ) => Promise<void>;
  };
  logo?: {
    url: string;
    alt?: string;
    shape?: 'unset' | 'circle';
  };
  backgroundImage?: {
    url: string;
  };
  spotlight?: {
    hideSpotlightButtons?: boolean;
  };
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  richTextEditor?: boolean;
  /**
   * Options for settings related to joining a call.
   */
  joinCallOptions?: {
    /**
     * options for checking microphone permissions when joining a call.
     * block on access will block the user from joining the call if the microphone permission is not granted.
     * skip will allow the user to join the call without granting the microphone permission.
     * @defaultValue 'requireMicrophoneAvailable'
     */
    microphoneCheck?: 'requireMicrophoneAvailable' | 'skip';
  };
  /**
   * Options for hiding the local screen share stream
   * @defaultValue false
   */
  hideLocalScreenShareStream?: boolean;
};

const CallWithChatScreen = (props: CallWithChatScreenProps): JSX.Element => {
  const { callWithChatAdapter, fluentTheme, formFactor = 'desktop' } = props;
  const { surveyOptions } = props;
  const mobileView = formFactor === 'mobile';

  if (!callWithChatAdapter) {
    throw new Error('CallWithChatAdapter is undefined');
  }

  const callAdapter: CallAdapter = useMemo(
    () => new CallWithChatBackedCallAdapter(callWithChatAdapter),
    [callWithChatAdapter]
  );

  const [currentCallState, setCurrentCallState] = useState<CallState>();
  const [isChatInitialized, setIsChatInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState<CallCompositePage>();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCallWithChatPage = (newState: CallWithChatAdapterState): void => {
      setCurrentPage(newState.page);
      setCurrentCallState(newState.call?.state);
      setIsChatInitialized(newState.chat ? true : false);
    };
    updateCallWithChatPage(callWithChatAdapter.getState());
    callWithChatAdapter.onStateChange(updateCallWithChatPage);
    return () => {
      callWithChatAdapter.offStateChange(updateCallWithChatPage);
    };
  }, [callWithChatAdapter]);

  const chatAdapter: ChatAdapter = useMemo(() => {
    return new CallWithChatBackedChatAdapter(callWithChatAdapter);
  }, [callWithChatAdapter]);

  /** Constant setting of id for the parent stack of the composite */
  const compositeParentDivId = useId('callWithChatCompositeParentDiv-internal');

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);
  const openChat = useCallback(() => {
    setIsChatOpen(true);
    // timeout is required to give the window time to render the sendbox so we have something to send focus to.
    // TODO: Selecting elements in the DOM via attributes is not stable. We should expose an API from ChatComposite to be able to focus on the sendbox.
    const chatFocusTimeout = setInterval(() => {
      const callWithChatCompositeRootDiv = document.querySelector(`[id="${compositeParentDivId}"]`);
      const sendbox = callWithChatCompositeRootDiv?.querySelector(`[id="sendbox"]`) as HTMLTextAreaElement;
      if (sendbox !== null) {
        sendbox.focus();
        clearInterval(chatFocusTimeout);
      }
    }, 3);
    setTimeout(() => {
      clearInterval(chatFocusTimeout);
    }, 300);
  }, [compositeParentDivId]);

  const isOnHold = currentPage === 'hold';
  useEffect(() => {
    if (isOnHold) {
      closeChat();
    }
  }, [closeChat, isOnHold]);

  const hasJoinedCall = !!(currentPage && hasJoinedCallFn(currentPage, currentCallState ?? 'None'));
  const toggleChat = useCallback(() => {
    isChatOpen || !hasJoinedCall ? closeChat() : openChat();
  }, [closeChat, hasJoinedCall, isChatOpen, openChat]);

  const callWithChatStrings = useCallWithChatCompositeStrings();
  const chatButtonStrings = useMemo(
    () => ({
      label: callWithChatStrings.chatButtonLabel,
      tooltipOffContent: callWithChatStrings.chatButtonTooltipOpen,
      tooltipOnContent: callWithChatStrings.chatButtonTooltipClose
    }),
    [callWithChatStrings]
  );
  const theme = useTheme();
  const commonButtonStyles = useMemo(
    () => (!mobileView ? getDesktopCommonButtonStyles(theme) : undefined),
    [mobileView, theme]
  );

  const showChatButton = checkShowChatButton(props.callControls);
  const chatButtonDisabled =
    showChatButton && (checkChatButtonIsDisabled(props.callControls) || !hasJoinedCall || isOnHold);
  const chatTabHeaderProps = useMemo(
    () =>
      mobileView && showChatButton
        ? {
            onClick: toggleChat,
            disabled: chatButtonDisabled
          }
        : undefined,
    [chatButtonDisabled, mobileView, toggleChat, showChatButton]
  );

  const unreadChatMessagesCount = useUnreadMessagesTracker(chatAdapter, isChatOpen, isChatInitialized);

  const customChatButton: CustomCallControlButtonCallback = useCallback(
    (args: CustomCallControlButtonCallbackArgs) => ({
      placement: mobileView ? 'primary' : 'secondary',
      onRenderButton: () => (
        <ChatButtonWithUnreadMessagesBadge
          checked={isChatOpen}
          showLabel={args.displayType !== 'compact'}
          onClick={toggleChat}
          disabled={chatButtonDisabled}
          strings={chatButtonStrings}
          styles={commonButtonStyles}
          newMessageLabel={callWithChatStrings.chatButtonNewMessageNotificationLabel}
          unreadChatMessagesCount={unreadChatMessagesCount}
          // As chat is disabled when on hold, we don't want to show the unread badge when on hold
          hideUnreadChatMessagesBadge={isOnHold}
          disableTooltip={mobileView}
        />
      )
    }),
    [
      callWithChatStrings.chatButtonNewMessageNotificationLabel,
      chatButtonStrings,
      commonButtonStyles,
      isChatOpen,
      chatButtonDisabled,
      mobileView,
      toggleChat,
      unreadChatMessagesCount,
      isOnHold
    ]
  );

  const callControlOptionsFromProps = useMemo(
    () => ({
      ...(typeof props.callControls === 'object' ? props.callControls : {})
    }),
    [props.callControls]
  );

  const injectedCustomButtonsFromProps = useMemo(() => {
    return [...(callControlOptionsFromProps.onFetchCustomButtonProps ?? [])];
  }, [callControlOptionsFromProps]);

  const callCompositeOptions: CallCompositeOptions = useMemo(
    () => ({
      callControls:
        props.callControls === false
          ? false
          : ({
              ...callControlOptionsFromProps,
              onFetchCustomButtonProps: [
                ...(showChatButton ? [customChatButton] : []),
                ...injectedCustomButtonsFromProps
              ],
              legacyControlBarExperience: false
            } as CallControlOptions),
      /* @conditional-compile-remove(call-readiness) */
      deviceChecks: props.deviceChecks,
      /* @conditional-compile-remove(call-readiness) */
      onNetworkingTroubleShootingClick: props.onNetworkingTroubleShootingClick,
      /* @conditional-compile-remove(call-readiness) */
      onPermissionsTroubleshootingClick: props.onPermissionsTroubleshootingClick,
      /* @conditional-compile-remove(unsupported-browser) */
      onEnvironmentInfoTroubleshootingClick: props.onEnvironmentInfoTroubleshootingClick,
      remoteVideoTileMenuOptions: props.remoteVideoTileMenuOptions,

      galleryOptions: props.galleryOptions,
      localVideoTile: props.localVideoTile,
      surveyOptions: surveyOptions,
      branding: {
        logo: props.logo,
        backgroundImage: props.backgroundImage
      },
      spotlight: props.spotlight,
      joinCallOptions: props.joinCallOptions,
      hideLocalScreenShareStream: props.hideLocalScreenShareStream
    }),
    [
      props.callControls,
      callControlOptionsFromProps,
      showChatButton,
      customChatButton,
      injectedCustomButtonsFromProps,
      /* @conditional-compile-remove(call-readiness) */
      props.deviceChecks,
      /* @conditional-compile-remove(unsupported-browser) */
      props.onEnvironmentInfoTroubleshootingClick,
      /* @conditional-compile-remove(call-readiness) */
      props.onNetworkingTroubleShootingClick,
      /* @conditional-compile-remove(call-readiness) */
      props.onPermissionsTroubleshootingClick,
      props.galleryOptions,
      props.localVideoTile,
      props.remoteVideoTileMenuOptions,
      surveyOptions,
      props.logo,
      props.backgroundImage,
      props.spotlight,
      props.joinCallOptions,
      props.hideLocalScreenShareStream
    ]
  );

  const chatCompositeOptions: ChatCompositeOptions = useMemo(
    () => ({
      topic: false,
      /* @conditional-compile-remove(chat-composite-participant-pane) */
      participantPane: false,
      /* @conditional-compile-remove(file-sharing-acs) */
      attachmentOptions: props.attachmentOptions,
      /* @conditional-compile-remove(rich-text-editor-composite-support) */
      richTextEditor: props.richTextEditor
    }),
    [
      /* @conditional-compile-remove(file-sharing-acs) */
      props.attachmentOptions,
      /* @conditional-compile-remove(rich-text-editor-composite-support) */
      props.richTextEditor
    ]
  );

  /* @conditional-compile-remove(breakout-rooms) */
  const chatSpinnerLabel = useLocale().strings.callWithChat.chatContentSpinnerLabel;

  const onRenderChatContent = useCallback((): JSX.Element => {
    /* @conditional-compile-remove(breakout-rooms) */
    if (!isChatInitialized) {
      return (
        <Stack styles={chatSpinnerContainerStyles}>
          <Spinner label={chatSpinnerLabel} size={SpinnerSize.large} />
        </Stack>
      );
    }
    return (
      <ChatComposite
        adapter={chatAdapter}
        fluentTheme={theme}
        options={chatCompositeOptions}
        onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
      />
    );
  }, [
    chatAdapter,
    props.onFetchAvatarPersonaData,
    chatCompositeOptions,
    theme,
    /* @conditional-compile-remove(breakout-rooms) */ isChatInitialized,
    /* @conditional-compile-remove(breakout-rooms) */ chatSpinnerLabel
  ]);

  let chatPaneTitle = callWithChatStrings.chatPaneTitle;
  /* @conditional-compile-remove(breakout-rooms) */
  // If breakout room settings are defined then we know we are in a breakout room so we should
  // use the breakout room chat pane title.
  if (callAdapter.getState().call?.breakoutRooms?.breakoutRoomSettings) {
    chatPaneTitle = callWithChatStrings.breakoutRoomChatPaneTitle;
  }

  const sidePaneHeaderRenderer = useCallback(
    () => (
      <SidePaneHeader
        headingText={chatPaneTitle}
        onClose={closeChat}
        dismissSidePaneButtonAriaLabel={callWithChatStrings.dismissSidePaneButtonLabel ?? ''}
        mobileView={mobileView}
        chatButtonPresent={showChatButton}
      />
    ),
    [chatPaneTitle, closeChat, callWithChatStrings.dismissSidePaneButtonLabel, mobileView, showChatButton]
  );

  const sidePaneContentRenderer = useMemo(
    () => (hasJoinedCall ? onRenderChatContent : undefined),
    [hasJoinedCall, onRenderChatContent]
  );

  const sidePaneRenderer = useMemo(
    () => ({
      contentRenderer: sidePaneContentRenderer,
      headerRenderer: sidePaneHeaderRenderer,
      id: 'chat'
    }),
    [sidePaneContentRenderer, sidePaneHeaderRenderer]
  );

  const overrideSidePaneProps: InjectedSidePaneProps = useMemo(
    () => ({
      renderer: sidePaneRenderer,
      isActive: isChatOpen,
      persistRenderingWhenClosed: true
    }),
    [isChatOpen, sidePaneRenderer]
  );

  const onSidePaneIdChange = useCallback(
    (sidePaneId: string | undefined) => {
      // If the pane is switched to something other than chat, removing rendering chat.
      if (sidePaneId && sidePaneId !== 'chat') {
        closeChat();
      }
    },
    [closeChat]
  );

  // When the call ends ensure the side pane is set to closed to prevent the side pane being open if the call is re-joined.
  useEffect(() => {
    callAdapter.on('callEnded', closeChat);
    return () => {
      callAdapter.off('callEnded', closeChat);
    };
  }, [callAdapter, closeChat]);

  return (
    <div ref={containerRef} className={mergeStyles(containerDivStyles)}>
      <Stack verticalFill grow styles={compositeOuterContainerStyles} id={compositeParentDivId}>
        <Stack horizontal grow>
          <Stack.Item grow styles={callCompositeContainerStyles(mobileView)}>
            <CallCompositeInner
              {...props}
              formFactor={formFactor}
              options={callCompositeOptions}
              adapter={callAdapter}
              fluentTheme={fluentTheme}
              callInvitationUrl={props.joinInvitationURL}
              overrideSidePane={overrideSidePaneProps}
              onSidePaneIdChange={onSidePaneIdChange}
              mobileChatTabHeader={chatTabHeaderProps}
              onCloseChatPane={closeChat}
            />
          </Stack.Item>
        </Stack>
      </Stack>
    </div>
  );
};

/**
 * CallWithChatComposite brings together key components to provide a full call with chat experience out of the box.
 *
 * @public
 */
export const CallWithChatComposite = (props: CallWithChatCompositeProps): JSX.Element => {
  const { adapter, fluentTheme, rtl, formFactor, joinInvitationURL, options } = props;
  return (
    <BaseProvider
      fluentTheme={fluentTheme}
      rtl={rtl}
      locale={props.locale}
      icons={props.icons}
      formFactor={props.formFactor}
    >
      <CallWithChatScreen
        {...props}
        /* @conditional-compile-remove(call-readiness) */
        deviceChecks={options?.deviceChecks}
        callWithChatAdapter={adapter}
        formFactor={formFactor}
        callControls={options?.callControls}
        joinInvitationURL={joinInvitationURL}
        fluentTheme={fluentTheme}
        remoteVideoTileMenuOptions={options?.remoteVideoTileMenuOptions}
        /* @conditional-compile-remove(file-sharing-acs) */
        attachmentOptions={options?.attachmentOptions}
        localVideoTile={options?.localVideoTile}
        galleryOptions={options?.galleryOptions}
        logo={options?.branding?.logo}
        backgroundImage={options?.branding?.backgroundImage}
        surveyOptions={options?.surveyOptions}
        spotlight={options?.spotlight}
        /* @conditional-compile-remove(rich-text-editor-composite-support) */
        richTextEditor={options?.richTextEditor}
        joinCallOptions={options?.joinCallOptions}
        hideLocalScreenShareStream={options?.hideLocalScreenShareStream}
      />
    </BaseProvider>
  );
};

const hasJoinedCallFn = (page: CallCompositePage, callStatus: CallState): boolean => {
  return (
    (page === 'call' &&
      (callStatus === 'Connected' || callStatus === 'RemoteHold' || callStatus === 'Disconnecting')) ||
    (page === 'hold' && (callStatus === 'LocalHold' || callStatus === 'Disconnecting'))
  );
};

const checkShowChatButton = (callControls?: boolean | CallWithChatControlOptions): boolean => {
  if (callControls === undefined || callControls === true) {
    return true;
  }
  if (callControls === false) {
    return false;
  }
  return callControls.chatButton !== false;
};

const checkChatButtonIsDisabled = (callControls?: boolean | CallWithChatControlOptions): boolean => {
  return typeof callControls === 'object' && isDisabled(callControls?.chatButton);
};
