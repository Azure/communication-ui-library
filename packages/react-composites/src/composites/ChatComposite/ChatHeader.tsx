// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React from 'react';
import * as reselect from 'reselect';
import { ChatClientState } from '@internal/chat-stateful-client';
import { ChatBaseSelectorProps } from '@internal/chat-component-bindings';
import { chatHeaderContainerStyle, topicNameLabelStyle } from './styles/Chat.styles';
import { CHAT_UI_IDS } from './identifiers';

export type HeaderProps = {
  topic: string;
};

export const ChatHeader = (props: HeaderProps): JSX.Element => {
  return (
    <Stack data-ui-id={CHAT_UI_IDS.chatHeader} className={chatHeaderContainerStyle} horizontal>
      <Stack.Item align="center" style={{ minWidth: '12.5rem' }}>
        <div data-ui-id={CHAT_UI_IDS.chatHeaderTopic} className={topicNameLabelStyle}>
          {props.topic}
        </div>
      </Stack.Item>
    </Stack>
  );
};

// TODO: Consider exporting building-block selectors internally to composites.
// This will avoid code duplication but still keep the public API clean.
export const getTopicName = (state: ChatClientState, props: ChatBaseSelectorProps): string => {
  return state.threads[props.threadId]?.properties?.topic || '';
};

export const getHeaderProps = reselect.createSelector([getTopicName], (topic): HeaderProps => {
  return { topic: topic };
});
