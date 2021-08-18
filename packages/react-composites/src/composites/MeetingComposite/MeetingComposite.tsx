// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState, useEffect } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallCompositeInternal } from '../CallComposite/Call';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { EmbeddedChatPane, EmbeddedPeoplePane } from './SidePane';
import { MeetingCallControlBar } from './MeetingCallControlBar';
import { CallState } from '@azure/communication-calling';
import { compositeOuterContainerStyles } from './styles/MeetingCompositeStyles';
import { FluentThemeProvider } from '@internal/react-components';
import { MeetingAdapter, MeetingBackedCallAdapter, MeetingBackedChatAdapter } from './adapter/MeetingAdapter';
import { MeetingCompositePage } from './state/MeetingCompositePage';
import { CallAdapter } from '../CallComposite';
import { ChatAdapter } from '../ChatComposite';

/**
 * Props required for the {@link MeetingComposite}
 */
export type MeetingCompositeProps = {
  meetingAdapter: MeetingAdapter;
  /**
   * Fluent theme for the composite.
   *
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  meetingInvitationURL?: string;
};

/**
 * Meeting Composite brings together key components to provide a full meeting experience out of the box.
 */
export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { meetingAdapter, fluentTheme } = props;

  if (!meetingAdapter) {
    throw 'Meeting adapter is undefined';
  }

  const [callAdapter, setCallAdapter] = useState<CallAdapter>(new MeetingBackedCallAdapter(meetingAdapter));
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>(new MeetingBackedChatAdapter(meetingAdapter));

  useEffect(() => {
    setCallAdapter(new MeetingBackedCallAdapter(meetingAdapter));
    setChatAdapter(new MeetingBackedChatAdapter(meetingAdapter));
  }, [meetingAdapter]);

  const [currentMeetingState, setCurrentMeetingState] = useState<CallState>();
  const [currentPage, setCurrentPage] = useState<MeetingCompositePage>();
  meetingAdapter.onStateChange((newState) => {
    setCurrentPage(newState.page);
    setCurrentMeetingState(newState.meeting?.state);
  });
  const hasJoinedCall =
    currentPage === 'meeting' &&
    currentMeetingState &&
    !['Connecting', 'Ringing', 'InLobby'].includes(currentMeetingState);

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

  const endCallClick = (): void => {
    meetingAdapter.setPage('configuration');
  };

  return (
    <FluentThemeProvider fluentTheme={props.fluentTheme}>
      <Stack verticalFill grow styles={compositeOuterContainerStyles}>
        <Stack horizontal grow>
          <Stack.Item grow>
            <CallCompositeInternal showCallControls={false} adapter={callAdapter} fluentTheme={fluentTheme} />
          </Stack.Item>
          {chatAdapter && (
            <EmbeddedChatPane
              hidden={!showChat}
              chatAdapter={chatAdapter}
              fluentTheme={props.fluentTheme}
              onClose={closePane}
            />
          )}
          {callAdapter && chatAdapter && (
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
        {hasJoinedCall && (
          <MeetingCallControlBar
            callAdapter={callAdapter}
            chatButtonChecked={showChat}
            onChatButtonClicked={toggleChat}
            peopleButtonChecked={showPeople}
            onPeopleButtonClicked={togglePeople}
            onEndCallClick={endCallClick}
          />
        )}
      </Stack>
    </FluentThemeProvider>
  );
};
