// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React from 'react';
import * as reselect from 'reselect';
import { ChatClientState } from '@internal/chat-stateful-client';
import { ChatBaseSelectorProps } from '@internal/chat-component-bindings';
import { chatHeaderContainerStyle, topicNameLabelStyle } from './styles/Chat.styles';

/**
 * @private
 */
export type HeaderProps = {
  topic: string;
};

/**
 * @private
 */
export const ChatHeader = (props: HeaderProps): JSX.Element => {
  return (
    <Stack className={chatHeaderContainerStyle} horizontal>
      <Stack.Item align="center">
        <div className={topicNameLabelStyle}>{props.topic}</div>
      </Stack.Item>
    </Stack>
  );
};

const getTopicName = (state: ChatClientState, props: ChatBaseSelectorProps): string => {
  return state.threads[props.threadId]?.properties?.topic || '';
};

/**
 * @private
 */
export const getHeaderProps = reselect.createSelector([getTopicName], (topic): HeaderProps => {
  return { topic: topic };
});
