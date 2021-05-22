// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React from 'react';
import { ChatClientState } from 'chat-stateful-client';
import { ChatBaseSelectorProps } from '@azure/acs-chat-selector';
import { chatHeaderContainerStyle, topicNameLabelStyle } from './styles/Chat.styles';

export type HeaderProps = {
  topic: string;
};

export const ChatHeader = (props: HeaderProps): JSX.Element => {
  return (
    <Stack className={chatHeaderContainerStyle} horizontal>
      <Stack.Item align="center" style={{ minWidth: '12.5rem' }}>
        <div className={topicNameLabelStyle}>{props.topic}</div>
      </Stack.Item>
    </Stack>
  );
};

export const getHeaderProps = (state: ChatClientState, props: ChatBaseSelectorProps): HeaderProps => {
  return {
    topic: state.threads.get(props.threadId)?.properties?.topic || ''
  };
};
