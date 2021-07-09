// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { CommandBarButton, DefaultButton, PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite, CallAdapter } from '../CallComposite';
import { ChatComposite, ChatAdapter } from '../ChatComposite';
import {
  sidePaneContainerStyles,
  sidePaneHeaderStyles,
  sidePaneBodyStyles,
  peopleSubheadingStyle
} from './styles/SidePane.styles';
import { ParticipantList, CommunicationParticipant } from '@internal/react-components';

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

const EmbeddedChatPane = (props: { adapter; fluentTheme; onClose: () => void }): JSX.Element => {
  const { adapter, fluentTheme, onClose } = props;
  return (
    <Stack styles={sidePaneContainerStyles}>
      <Stack.Item>
        <Stack horizontal horizontalAlign="space-between" styles={sidePaneHeaderStyles}>
          <Stack.Item>Chat</Stack.Item>
          <CommandBarButton text="✖" onClick={onClose} />
        </Stack>
      </Stack.Item>
      <Stack.Item styles={sidePaneBodyStyles}>
        <ChatComposite adapter={adapter} fluentTheme={fluentTheme} />
      </Stack.Item>
    </Stack>
  );
};

const EmbeddedPeoplePane = (props: {
  inviteLink?: string;
  participants: CommunicationParticipant[];
  onClose: () => void;
}): JSX.Element => {
  const { onClose, inviteLink, participants } = props;
  return (
    <Stack styles={sidePaneContainerStyles} tokens={{ childrenGap: '0.5rem' }}>
      <Stack.Item>
        <Stack horizontal horizontalAlign="space-between" styles={sidePaneHeaderStyles}>
          <Stack.Item>People</Stack.Item>
          <CommandBarButton text="✖" onClick={onClose} />
        </Stack>
      </Stack.Item>
      <Stack.Item styles={sidePaneBodyStyles}>
        <Stack tokens={{ childrenGap: '0.5rem' }}>
          {inviteLink && <DefaultButton text="Copy invite link" iconProps={{ iconName: 'Link' }} />}
          <Stack.Item styles={peopleSubheadingStyle}>In this call</Stack.Item>
          <ParticipantList myUserId={'0'} participants={participants} />
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { callAdapter, chatAdapter, fluentTheme, meetingInvitationURL } = props;

  const [showChatPane, setShowChatPane] = useState(false);
  const [showPeoplePane, setShowPeoplePane] = useState(false);

  // const remoteMeetingParticipants = props.callAdapter.getState().call?.remoteParticipants;
  const meetingParticipants: CommunicationParticipant[] = [
    {
      userId: callAdapter.getState().userId.communicationUserId,
      displayName: callAdapter.getState().displayName
    }
  ];

  const pane = showChatPane
    ? () => <EmbeddedChatPane adapter={chatAdapter} fluentTheme={fluentTheme} onClose={() => setShowChatPane(false)} />
    : showPeoplePane
    ? () => (
        <EmbeddedPeoplePane
          participants={meetingParticipants}
          inviteLink={meetingInvitationURL ?? 'TODO: set this up'}
          onClose={() => setShowPeoplePane(false)}
        />
      )
    : undefined;

  return (
    <CallComposite
      adapter={callAdapter}
      fluentTheme={fluentTheme}
      onRenderPane={pane}
      onChatButtonClick={() => {
        setShowPeoplePane(false);
        setShowChatPane(!showChatPane);
      }}
      onPeopleButtonClick={() => {
        setShowChatPane(false);
        setShowPeoplePane(!showPeoplePane);
      }}
      showParticipantsButton={false}
      showSideChatButton={true}
      showSidePeopleButton={true}
      chatButtonChecked={showChatPane}
      peopleButtonChecked={showPeoplePane}
    />
  );
};
