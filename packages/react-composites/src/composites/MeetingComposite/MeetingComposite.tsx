// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite } from '../CallComposite';
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
 * @alpha
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
 * @alpha
 */
export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { callAdapter, chatAdapter, fluentTheme } = props;

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
      <Stack verticalFill grow styles={compositeOuterContainerStyles}>
        <Stack horizontal grow>
          <Stack.Item grow>
            <CallComposite
              visualElements={{ showCallControls: false }}
              adapter={callAdapter}
              fluentTheme={fluentTheme}
            />
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
