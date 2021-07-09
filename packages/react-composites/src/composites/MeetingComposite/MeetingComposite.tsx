// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState } from 'react';
import { CommandBarButton, PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite, CallAdapter } from '../CallComposite';
import { ChatComposite, ChatAdapter } from '../ChatComposite';
import { sidePaneContainerStyles, sidePaneHeaderStyles, sidePaneBodyStyles } from './styles/SidePane.styles';

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

export const MeetingComposite = (props: MeetingCompositeProps): JSX.Element => {
  const { callAdapter, chatAdapter, fluentTheme } = props;

  const [showPane, setShowPane] = useState(false);

  return (
    <CallComposite
      adapter={callAdapter}
      fluentTheme={fluentTheme}
      showCallScreenPane={showPane}
      onRenderPane={() => (
        <EmbeddedChatPane adapter={chatAdapter} fluentTheme={fluentTheme} onClose={() => setShowPane(false)} />
      )}
      onToggleChat={() => {
        setShowPane(!showPane);
      }}
      showChatButton={true}
    />
  );
};
