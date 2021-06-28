// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PartialTheme, Theme, Stack } from '@fluentui/react';
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
};

export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { callAdapter, chatAdapter, fluentTheme } = props;

  return (
    <Stack>
      <CallComposite adapter={callAdapter} fluentTheme={fluentTheme} />
      <ChatComposite adapter={chatAdapter} fluentTheme={fluentTheme} />
    </Stack>
  );
};
