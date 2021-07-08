// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { PartialTheme, Theme } from '@fluentui/react';
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

let cachedChatComposite: null | JSX.Element = null;
const getChatComposite = (chatAdapter: ChatAdapter, fluentTheme?: PartialTheme | Theme): JSX.Element => {
  if (!cachedChatComposite) {
    cachedChatComposite = <ChatComposite adapter={chatAdapter} fluentTheme={fluentTheme} />;
  }
  return cachedChatComposite;
};

export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { callAdapter, chatAdapter, fluentTheme } = props;

  return (
    <CallComposite
      adapter={callAdapter}
      fluentTheme={fluentTheme}
      showCallScreenPane={true}
      onRenderPane={() => getChatComposite(chatAdapter, fluentTheme)}
    />
  );
};
