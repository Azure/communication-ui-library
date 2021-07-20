// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite, CallAdapter, CallCompositePage } from '../CallComposite';
import { ChatAdapter } from '../ChatComposite';
import { EmbeddedChatPane, EmbeddedPeoplePane } from './SidePane';
import { ChatButton } from './ChatButton';
import { PeopleButton } from './PeopleButton';
import { CommunicationParticipant } from '@internal/react-components';

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

export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { callAdapter, fluentTheme } = props;

  const [currentPage, setCurrentPage] = useState<CallCompositePage>();

  // Future work item: get correct participants
  const myUserId = callAdapter.getState().userId.communicationUserId;
  const selfParticipant: CommunicationParticipant = {
    displayName: callAdapter.getState().displayName,
    userId: myUserId
  };
  const [participants] = useState<CommunicationParticipant[]>([selfParticipant]);
  callAdapter.onStateChange((newState) => {
    setCurrentPage(newState.page);
  });
  const showPaneControls = currentPage === 'call';

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

  return (
    <Stack styles={{ root: { width: '100%', height: '100%' } }} horizontal>
      <CallComposite adapter={callAdapter} fluentTheme={fluentTheme} />
      {showPaneControls && (
        <Stack>
          <Stack.Item grow>
            {showChat && (
              <EmbeddedChatPane chatAdapter={props.chatAdapter} fluentTheme={props.fluentTheme} onClose={closePane} />
            )}
            {showPeople && (
              <EmbeddedPeoplePane
                inviteLink={props.meetingInvitationURL}
                myUserId={myUserId}
                participants={participants}
                onClose={closePane}
              />
            )}
          </Stack.Item>
          <Stack horizontal>
            <ChatButton checked={showChat} showLabel={true} onClick={toggleChat} />
            <PeopleButton checked={showPeople} showLabel={true} onClick={togglePeople} />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
