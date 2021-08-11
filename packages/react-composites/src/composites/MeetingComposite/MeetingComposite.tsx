// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallCompositeInternal } from '../CallComposite/Call';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter, CallCompositePage } from '../CallComposite';
import { ChatAdapter } from '../ChatComposite';
import { EmbeddedChatPane, EmbeddedPeoplePane } from './SidePane';
import { MeetingCallControlBar } from './MeetingCallControlBar';
import { CallState } from '@azure/communication-calling';
import { compositeOuterContainerStyles } from './styles/MeetingCompositeStyles';
import { FluentThemeProvider } from '@internal/react-components';

/**
 * Props required for the {@link MeetingComposite}
 */
export type MeetingCompositeProps = {
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
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
  const { callAdapter, fluentTheme } = props;

  const [currentCallState, setCurrentCallState] = useState<CallState>();
  const [currentPage, setCurrentPage] = useState<CallCompositePage>();
  callAdapter.onStateChange((newState) => {
    setCurrentPage(newState.page);
    setCurrentCallState(newState.call?.state);
  });
  const hasJoinedCall =
    currentPage === 'call' && currentCallState && !['Connecting', 'Ringing', 'InLobby'].includes(currentCallState);

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
    callAdapter.setPage('configuration');
  };

  return (
    <FluentThemeProvider fluentTheme={props.fluentTheme}>
      <Stack grow styles={compositeOuterContainerStyles}>
        <Stack horizontal grow>
          <Stack.Item grow>
            <CallCompositeInternal showCallControls={false} adapter={callAdapter} fluentTheme={fluentTheme} />
          </Stack.Item>
          {showChat && (
            <EmbeddedChatPane chatAdapter={props.chatAdapter} fluentTheme={props.fluentTheme} onClose={closePane} />
          )}
          {showPeople && (
            <CallAdapterProvider adapter={props.callAdapter}>
              <EmbeddedPeoplePane inviteLink={props.meetingInvitationURL} onClose={closePane} />
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
