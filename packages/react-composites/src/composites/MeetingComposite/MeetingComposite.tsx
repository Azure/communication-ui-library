// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite, CallCompositePage, CallControlOptions } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { EmbeddedChatPane, EmbeddedPeoplePane } from './SidePane';
import { CallAndChatCallControlBar } from './MeetingCallControlBar';
import { CallState } from '@azure/communication-calling';
import { compositeOuterContainerStyles } from './styles/MeetingCompositeStyles';
import { CallAndChatAdapter } from './adapter/MeetingAdapter';
import { CallAndChatBackedCallAdapter } from './adapter/MeetingBackedCallAdapter';
import { CallAndChatBackedChatAdapter } from './adapter/MeetingBackedChatAdapter';
import { CallAdapter } from '../CallComposite';
import { ChatCompositeProps } from '../ChatComposite';
import { BaseComposite, BaseCompositeProps } from '../common/BaseComposite';
import { CallCompositeIcons, ChatCompositeIcons } from '../common/icons';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { ChatAdapterProvider } from '../ChatComposite/adapter/ChatAdapterProvider';
import { CallAndChatAdapterState } from './state/MeetingAdapterState';

/**
 * Props required for the {@link CallAndChatComposite}
 *
 * @beta
 */
export interface CallAndChatCompositeProps extends BaseCompositeProps<CallCompositeIcons & ChatCompositeIcons> {
  callAndChatAdapter: CallAndChatAdapter;
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
   * @beta
   */
  formFactor?: 'desktop' | 'mobile';
  /**
   * URL that can be used to copy a call-and-chat invite to the Users clipboard.
   */
  joinInvitationURL?: string;
  /**
   * Flags to enable/disable or customize UI elements of the {@link CallAndChatComposite}
   */
  options?: CallAndChatCompositeOptions;
}

/**
 * Optional features of the {@link CallAndChatComposite}.
 *
 * @beta
 */
export type CallAndChatCompositeOptions = {
  /**
   * Call control options to change what buttons show on the call-and-chat composite control bar.
   * If using the boolean values, true will cause default behavior across the whole control bar. False hides the whole control bar.
   */
  callControls?: boolean | CallAndChatControlOptions;
};
/**
 * Call-And-Chat Composite Call controls to show or hide buttons on the calling control bar.
 *
 * @beta
 */
export interface CallAndChatControlOptions
  extends Pick<CallControlOptions, 'cameraButton' | 'microphoneButton' | 'screenShareButton' | 'displayType'> {
  /**
   * Show or hide the chat button in the call-and-chat composite control bar.
   * @defaultValue true
   */
  chatButton?: boolean;
  /**
   * Show or hide the people button in the call-and-chat composite control bar.
   * @defaultValue true
   */
  peopleButton?: boolean;
}

type CallAndChatScreenProps = {
  callAndChatAdapter: CallAndChatAdapter;
  fluentTheme?: PartialTheme | Theme;
  formFactor?: 'desktop' | 'mobile';
  joinInvitationURL?: string;
  callControls?: boolean | CallAndChatControlOptions;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
};

const CallAndChatScreen = (props: CallAndChatScreenProps): JSX.Element => {
  const { callAndChatAdapter, fluentTheme, formFactor = 'desktop' } = props;
  if (!callAndChatAdapter) {
    throw new Error('CallAndChatAdapter is undefined');
  }

  const callAdapter: CallAdapter = useMemo(
    () => new CallAndChatBackedCallAdapter(callAndChatAdapter),
    [callAndChatAdapter]
  );

  const [currentCallState, setCurrentCallState] = useState<CallState>();
  const [currentPage, setCurrentPage] = useState<CallCompositePage>();
  const [showChat, setShowChat] = useState(false);
  const [showPeople, setShowPeople] = useState(false);

  useEffect(() => {
    const updateCallAndChatPage = (newState: CallAndChatAdapterState): void => {
      setCurrentPage(newState.page);
      setCurrentCallState(newState.call?.state);
    };
    callAndChatAdapter.onStateChange(updateCallAndChatPage);
    return () => {
      callAndChatAdapter.offStateChange(updateCallAndChatPage);
    };
  }, [callAndChatAdapter]);

  const closePane = useCallback(() => {
    setShowChat(false);
    setShowPeople(false);
  }, []);

  const toggleChat = useCallback(() => {
    setShowPeople(false);
    setShowChat(!showChat);
  }, [showChat]);

  const togglePeople = useCallback(() => {
    setShowChat(false);
    setShowPeople(!showPeople);
  }, [showPeople]);

  const chatProps: ChatCompositeProps = useMemo(() => {
    return {
      adapter: new CallAndChatBackedChatAdapter(callAndChatAdapter)
    };
  }, [callAndChatAdapter]);

  const isInLobbyOrConnecting = currentPage === 'lobby';
  const hasJoinedCall = !!(currentPage && hasJoinedCallFn(currentPage, currentCallState ?? 'None'));

  return (
    <Stack verticalFill grow styles={compositeOuterContainerStyles}>
      <Stack horizontal grow>
        <Stack.Item grow>
          <CallComposite
            {...props}
            formFactor={formFactor}
            options={{ callControls: false }}
            adapter={callAdapter}
            fluentTheme={fluentTheme}
          />
        </Stack.Item>
        {chatProps.adapter && hasJoinedCall && (
          <EmbeddedChatPane
            chatCompositeProps={chatProps}
            hidden={!showChat}
            chatAdapter={chatProps.adapter}
            fluentTheme={fluentTheme}
            onClose={closePane}
            onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
          />
        )}
        {callAdapter && chatProps.adapter && hasJoinedCall && (
          <CallAdapterProvider adapter={callAdapter}>
            <EmbeddedPeoplePane
              hidden={!showPeople}
              inviteLink={props.joinInvitationURL}
              onClose={closePane}
              chatAdapter={chatProps.adapter}
              callAdapter={callAdapter}
              onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
            />
          </CallAdapterProvider>
        )}
      </Stack>
      {(isInLobbyOrConnecting || hasJoinedCall) && (
        <ChatAdapterProvider adapter={chatProps.adapter}>
          <CallAndChatCallControlBar
            callAdapter={callAdapter}
            chatAdapter={chatProps.adapter}
            chatButtonChecked={showChat}
            onChatButtonClicked={toggleChat}
            peopleButtonChecked={showPeople}
            onPeopleButtonClicked={togglePeople}
            mobileView={props.formFactor === 'mobile'}
            disableButtonsForLobbyPage={isInLobbyOrConnecting}
            callControls={props.callControls}
          />
        </ChatAdapterProvider>
      )}
    </Stack>
  );
};

/**
 * Call-And-Chat Composite brings together key components to provide a full call with chat experience out of the box.
 *
 * @beta
 */
export const CallAndChatComposite = (props: CallAndChatCompositeProps): JSX.Element => {
  const { callAndChatAdapter, fluentTheme, formFactor, joinInvitationURL, options } = props;
  return (
    <BaseComposite fluentTheme={fluentTheme} locale={props.locale} icons={props.icons}>
      <CallAndChatScreen
        {...props}
        callAndChatAdapter={callAndChatAdapter}
        formFactor={formFactor}
        callControls={options?.callControls}
        joinInvitationURL={joinInvitationURL}
        fluentTheme={fluentTheme}
      />
    </BaseComposite>
  );
};

const hasJoinedCallFn = (page: CallCompositePage, callStatus: CallState): boolean =>
  page === 'call' && callStatus === 'Connected';
