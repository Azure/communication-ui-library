// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ChatScreen } from './ChatScreen';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { ChatAdapter } from './adapter/ChatAdapter';
import { Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { FluentThemeProvider } from 'react-components';

export type ChatCompositeProps = {
  adapter: ChatAdapter;
  /**
   * Fluent theme for the composite.
   *
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  onRenderAvatar?: (userId: string) => JSX.Element;
  options?: ChatOptions;
};

export type ChatOptions = {
  sendBoxMaxLength?: number; // Limit max send box length, when change viewport size
  // messagesPerPage?: number; // Number of messages per page - smaller for better perf
  // supportNewline: boolean; // Whether to support new line (shift+enter) in textArea, disable until ACS backend supports line switch
};

export const ChatComposite = (props: ChatCompositeProps): JSX.Element => {
  const { adapter, fluentTheme, options, onRenderAvatar } = props;

  return (
    <FluentThemeProvider fluentTheme={fluentTheme}>
      <ChatAdapterProvider adapter={adapter}>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <ChatScreen sendBoxMaxLength={options?.sendBoxMaxLength} onRenderAvatar={onRenderAvatar} />
      </ChatAdapterProvider>
    </FluentThemeProvider>
  );
};
