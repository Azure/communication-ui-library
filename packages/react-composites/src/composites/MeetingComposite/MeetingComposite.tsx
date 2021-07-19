// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite, CallAdapter } from '../CallComposite';
import { ChatAdapter } from '../ChatComposite';

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

const EmbeddedChatPane = (): JSX.Element => <></>;

const EmbeddedPeoplePane = (): JSX.Element => <></>;

const Pane = (props: { openPane?: 'chat' | 'people' }): JSX.Element =>
  props.openPane === 'chat' ? <EmbeddedChatPane /> : props.openPane === 'people' ? <EmbeddedPeoplePane /> : <></>;

export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { callAdapter, fluentTheme } = props;

  const [showChatPane] = useState(false);
  const [showPeoplePane] = useState(false);

  return (
    <Stack horizontal>
      <CallComposite adapter={callAdapter} fluentTheme={fluentTheme} />
      <Pane openPane={showChatPane ? 'chat' : showPeoplePane ? 'people' : undefined} />
    </Stack>
  );
};
