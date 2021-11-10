// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState, useMemo } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { EmbeddedChatPane, EmbeddedPeoplePane } from './SidePane';
import { MeetingCallControlBar } from './MeetingCallControlBar';
import { CallState } from '@azure/communication-calling';
import { compositeOuterContainerStyles } from './styles/MeetingCompositeStyles';
import { FluentThemeProvider } from '@internal/react-components';
import { MeetingAdapter } from './adapter/MeetingAdapter';
import { MeetingBackedCallAdapter } from './adapter/MeetingBackedCallAdapter';
import { MeetingBackedChatAdapter } from './adapter/MeetingBackedChatAdapter';
import { hasJoinedCall as hasJoinedCallFn, MeetingCompositePage } from './state/MeetingCompositePage';
import { CallAdapter } from '../CallComposite';
import { ChatAdapter } from '../ChatComposite';

/**
 * Props required for the {@link MeetingComposite}
 *
 * @alpha
 */
export type MeetingCompositeProps = {
  meetingAdapter: MeetingAdapter;
  /**
   * Fluent theme for the composite.
   *
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * URL that can be used to copy a meeting invite to the Users clipboard.
   */
  meetingInvitationURL?: string;
  /**
   * Flags to enable/disable or customize UI elements of the {@link CallComposite}.
   */
  options?: MeetingCompositeOptions;
};

/**
 * Optional features of the {@link MeetingComposite}
 *
 * @alpha
 */
export type MeetingCompositeOptions = {
  /**
   * Choose to use the composite form optimized for use on a mobile device.
   * @remarks This is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue false
   * @alpha
   */
  mobileView?: boolean;
};

/**
 * Meeting Composite brings together key components to provide a full meeting experience out of the box.
 *
 * @alpha
 */
export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { meetingAdapter, fluentTheme } = props;

  if (!meetingAdapter) {
    throw 'Meeting adapter is undefined';
  }

  const callAdapter: CallAdapter = useMemo(() => new MeetingBackedCallAdapter(meetingAdapter), [meetingAdapter]);
  const chatAdapter: ChatAdapter = useMemo(() => new MeetingBackedChatAdapter(meetingAdapter), [meetingAdapter]);

  const [currentMeetingState, setCurrentMeetingState] = useState<CallState>();
  const [currentPage, setCurrentPage] = useState<MeetingCompositePage>();
  meetingAdapter.onStateChange((newState) => {
    setCurrentPage(newState.page);
    setCurrentMeetingState(newState.meeting?.state);
  });

  const [showChat, setShowChat] = useState(false);
  const [showPeople, setShowPeople] = useState(false);

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

  const isInLobbyOrConnecting = currentPage === 'lobby';
  const hasJoinedCall = !!(currentPage && hasJoinedCallFn(currentPage, currentMeetingState ?? 'None'));
  return (
    <FluentThemeProvider fluentTheme={props.fluentTheme}>
      <Stack verticalFill grow styles={compositeOuterContainerStyles}>
        <Stack horizontal grow>
          <Stack.Item grow>
            <CallComposite
              options={{ callControls: false, mobileView: props.options?.mobileView }}
              adapter={callAdapter}
              fluentTheme={fluentTheme}
            />
          </Stack.Item>
          {chatAdapter && hasJoinedCall && (
            <EmbeddedChatPane
              hidden={!showChat}
              chatAdapter={chatAdapter}
              fluentTheme={props.fluentTheme}
              mobileView={props.options?.mobileView ?? false}
              onClose={closePane}
            />
          )}
          {callAdapter && chatAdapter && hasJoinedCall && (
            <CallAdapterProvider adapter={callAdapter}>
              <EmbeddedPeoplePane
                hidden={!showPeople}
                inviteLink={props.meetingInvitationURL}
                onClose={closePane}
                chatAdapter={chatAdapter}
                callAdapter={callAdapter}
              />
            </CallAdapterProvider>
          )}
        </Stack>
        {(isInLobbyOrConnecting || hasJoinedCall) && (
          <MeetingCallControlBar
            callAdapter={callAdapter}
            chatButtonChecked={showChat}
            onChatButtonClicked={toggleChat}
            peopleButtonChecked={showPeople}
            onPeopleButtonClicked={togglePeople}
            mobileView={props.options?.mobileView}
            disableButtonsForLobbyPage={isInLobbyOrConnecting}
          />
        )}
      </Stack>
    </FluentThemeProvider>
  );
};
