// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite, CallAdapter } from '../CallComposite';
import { ChatComposite, ChatAdapter } from '../ChatComposite';

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

const EmbeddedChatPane = (props: { chatAdapter: ChatAdapter; fluentTheme?: PartialTheme | Theme }): JSX.Element => (
  <ChatComposite adapter={props.chatAdapter} fluentTheme={props.fluentTheme} />
);

const EmbeddedPeoplePane = (): JSX.Element => <></>;

const SidePane = (props: { children?: React.ReactNode }): JSX.Element => <Stack>{props.children}</Stack>;

export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { callAdapter, fluentTheme } = props;

  const [showChat] = useState(true);
  const [showPeople] = useState(false);
  const sidePaneShowing = showChat || showPeople;

  return (
    <Stack horizontal>
      <CallComposite adapter={callAdapter} fluentTheme={fluentTheme} />
      {sidePaneShowing && (
        <SidePane>
          {showChat && <EmbeddedChatPane chatAdapter={props.chatAdapter} fluentTheme={props.fluentTheme} />}
          {showPeople && <EmbeddedPeoplePane />}
        </SidePane>
      )}
    </Stack>
  );
};
