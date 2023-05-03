// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { mergeStyles, PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallCompositePage } from '../CallComposite';
import { CallState } from '@azure/communication-calling';
import { callCompositeContainerStyles, compositeOuterContainerStyles } from './styles/CallWithChatCompositeStyles';
import { CallWithChatAdapter } from './adapter/CallWithChatAdapter';
import { CallWithChatBackedCallAdapter } from './adapter/CallWithChatBackedCallAdapter';
import { CallWithChatBackedChatAdapter } from './adapter/CallWithChatBackedChatAdapter';
import { CallAdapter } from '../CallComposite';
import { ChatComposite, ChatCompositeProps } from '../ChatComposite';
import { BaseProvider, BaseCompositeProps } from '../common/BaseComposite';
import { CallWithChatCompositeIcons } from '../common/icons';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { CallWithChatAdapterState } from './state/CallWithChatAdapterState';
import {
  ParticipantMenuItemsCallback,
  _useContainerHeight,
  _useContainerWidth,
  useTheme
} from '@internal/react-components';
import { useId } from '@fluentui/react-hooks';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingOptions } from '../ChatComposite';
import { containerDivStyles } from '../common/ContainerRectProps';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { CallCompositeInner, CallCompositeOptions } from '../CallComposite/CallComposite';
/* @conditional-compile-remove(call-readiness) */
import { DeviceCheckOptions } from '../CallComposite/CallComposite';
import {
  CommonCallControlOptions,
  CustomCallControlButtonCallbackArgs,
  _CommonCallControlOptions
} from '../common/types/CommonCallControlOptions';
import { ChatButtonWithUnreadMessagesBadge } from './ChatButton/ChatButtonWithUnreadMessagesBadge';
import { getDesktopCommonButtonStyles } from '../common/ControlBar/CommonCallControlBar';
import { InjectedSidePaneProps } from '../CallComposite/components/SidePane/SidePaneProvider';
import { isDisabled } from '../CallComposite/utils';
import { CustomCallControlButtonCallback } from '../common/ControlBar/CustomButton';
import { SidePaneHeader } from '../common/SidePaneHeader';
import { _CallControlOptions } from '../CallComposite/types/CallControlOptions';

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
  chatButton?: boolean | /* @conditional-compile-remove(PSTN-calls) */ { disabled: boolean };
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
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Properties for configuring the File Sharing feature.
   * If undefined, file sharing feature will be disabled.
   * @beta
   */
  fileSharing?: FileSharingOptions;
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
};

type CallWithChatScreenProps = {
  callWithChatAdapter: CallWithChatAdapter;
  fluentTheme?: PartialTheme | Theme;
  formFactor?: 'desktop' | 'mobile';
  joinInvitationURL?: string;
  callControls?: boolean | CallWithChatControlOptions;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  /* @conditional-compile-remove(file-sharing) */
  fileSharing?: FileSharingOptions;
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
};

const CallWithChatScreen = (props: CallWithChatScreenProps): JSX.Element => {
  const { callWithChatAdapter, fluentTheme, formFactor = 'desktop' } = props;
  const mobileView = formFactor === 'mobile';

  if (!callWithChatAdapter) {
    throw new Error('CallWithChatAdapter is undefined');
  }

  const callAdapter: CallAdapter = useMemo(
    () => new CallWithChatBackedCallAdapter(callWithChatAdapter),
    [callWithChatAdapter]
  );

  const [currentCallState, setCurrentCallState] = useState<CallState>();
  const [currentPage, setCurrentPage] = useState<CallCompositePage>();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCallWithChatPage = (newState: CallWithChatAdapterState): void => {
      setCurrentPage(newState.page);
      setCurrentCallState(newState.call?.state);
    };
    updateCallWithChatPage(callWithChatAdapter.getState());
    callWithChatAdapter.onStateChange(updateCallWithChatPage);
    return () => {
      callWithChatAdapter.offStateChange(updateCallWithChatPage);
    };
  }, [callWithChatAdapter]);

  const chatProps: ChatCompositeProps = useMemo(() => {
    return {
      adapter: new CallWithChatBackedChatAdapter(callWithChatAdapter)
    };
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
  const chatButtonDisabled = showChatButton && (checkChatButtonIsDisabled(props.callControls) || !hasJoinedCall);
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

  const customChatButton: CustomCallControlButtonCallback = useCallback(
    (args: CustomCallControlButtonCallbackArgs) => ({
      placement: mobileView ? 'primary' : 'secondary',
      onRenderButton: () => (
        <ChatButtonWithUnreadMessagesBadge
          chatAdapter={chatProps.adapter}
          isChatPaneVisible={isChatOpen}
          checked={isChatOpen}
          showLabel={args.displayType !== 'compact'}
          onClick={toggleChat}
          disabled={chatButtonDisabled}
          strings={chatButtonStrings}
          styles={commonButtonStyles}
          newMessageLabel={callWithChatStrings.chatButtonNewMessageNotificationLabel}
        />
      )
    }),
    [
      callWithChatStrings.chatButtonNewMessageNotificationLabel,
      chatButtonStrings,
      chatProps.adapter,
      commonButtonStyles,
      isChatOpen,
      chatButtonDisabled,
      mobileView,
      toggleChat
    ]
  );

  const callControlOptionsFromProps = useMemo(
    () => ({
      ...(typeof props.callControls === 'object' ? props.callControls : {})
    }),
    [props.callControls]
  );

  const injectedCustomButtonsFromProps = useMemo(() => {
    /* @conditional-compile-remove(control-bar-button-injection) */
    return [...(callControlOptionsFromProps.onFetchCustomButtonProps ?? [])];
    return [];
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
                /* @conditional-compile-remove(control-bar-button-injection) */
                ...injectedCustomButtonsFromProps
              ],
              legacyControlBarExperience: false
            } as _CallControlOptions),
      /* @conditional-compile-remove(call-readiness) */
      deviceChecks: props.deviceChecks,
      /* @conditional-compile-remove(call-readiness) */
      onNetworkingTroubleShootingClick: props.onNetworkingTroubleShootingClick,
      /* @conditional-compile-remove(call-readiness) */
      onPermissionsTroubleshootingClick: props.onPermissionsTroubleshootingClick,
      /* @conditional-compile-remove(unsupported-browser) */
      onEnvironmentInfoTroubleshootingClick: props.onEnvironmentInfoTroubleshootingClick
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
      props.onPermissionsTroubleshootingClick
    ]
  );

  const onRenderChatContent = useCallback(
    (): JSX.Element => (
      <ChatComposite
        {...chatProps}
        fluentTheme={theme}
        options={{
          topic: false,
          /* @conditional-compile-remove(chat-composite-participant-pane) */
          participantPane: false,
          /* @conditional-compile-remove(file-sharing) */
          fileSharing: props.fileSharing
        }}
        onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
      />
    ),
    [
      chatProps,
      /* @conditional-compile-remove(file-sharing) */ props.fileSharing,
      props.onFetchAvatarPersonaData,
      theme
    ]
  );

  const sidePaneHeaderRenderer = useCallback(
    () => (
      <SidePaneHeader
        headingText={callWithChatStrings.chatPaneTitle}
        onClose={closeChat}
        dismissSidePaneButtonAriaLabel={callWithChatStrings.dismissSidePaneButtonLabel ?? ''}
        mobileView={mobileView}
      />
    ),
    [callWithChatStrings.chatPaneTitle, callWithChatStrings.dismissSidePaneButtonLabel, closeChat, mobileView]
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
    (sidePaneId) => {
      // If the pane is switched to something other than chat, removing rendering chat.
      if (sidePaneId && sidePaneId !== 'chat') {
        closeChat();
      }
    },
    [closeChat]
  );

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
    <BaseProvider fluentTheme={fluentTheme} rtl={rtl} locale={props.locale} icons={props.icons}>
      <CallWithChatScreen
        {...props}
        /* @conditional-compile-remove(call-readiness) */
        deviceChecks={options?.deviceChecks}
        callWithChatAdapter={adapter}
        formFactor={formFactor}
        callControls={options?.callControls}
        joinInvitationURL={joinInvitationURL}
        fluentTheme={fluentTheme}
        /* @conditional-compile-remove(file-sharing) */
        fileSharing={options?.fileSharing}
      />
    </BaseProvider>
  );
};

const hasJoinedCallFn = (page: CallCompositePage, callStatus: CallState): boolean => {
  /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(one-to-n-calling) */
  return (
    (page === 'call' &&
      (callStatus === 'Connected' || callStatus === 'RemoteHold' || callStatus === 'Disconnecting')) ||
    (page === 'hold' && (callStatus === 'LocalHold' || callStatus === 'Disconnecting'))
  );
  return page === 'call' && (callStatus === 'Connected' || callStatus === 'Disconnecting');
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
