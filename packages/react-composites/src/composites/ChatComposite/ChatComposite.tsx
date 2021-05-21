// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ChatScreen } from './ChatScreen';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { ChatAdapter } from './adapter/ChatAdapter';

export type ChatProps = {
  adapter: ChatAdapter;
  onRenderAvatar?: (userId: string) => JSX.Element;
  options?: ChatOptions;
};

export type ChatOptions = {
  sendBoxMaxLength?: number; // Limit max send box length, when change viewport size
  // messagesPerPage?: number; // Number of messages per page - smaller for better perf
  // supportNewline: boolean; // Whether to support new line (shift+enter) in textArea, disable until ACS backend supports line switch
};

export const ChatComposite = (props: ChatProps): JSX.Element => {
  const { adapter, options, onRenderAvatar } = props;

  return (
    <ChatAdapterProvider adapter={adapter}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <ChatScreen sendBoxMaxLength={options?.sendBoxMaxLength} onRenderAvatar={onRenderAvatar} />
    </ChatAdapterProvider>
  );
};
