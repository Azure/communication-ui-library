// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { ChatClientState } from 'chat-stateful-client';
import { ChatBaseSelectorProps } from '@azure/acs-chat-selector';
import { MessageThread, ParticipantList, SendBox, TypingIndicator } from 'react-components';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';
import {
  chatContainer,
  chatHeaderContainerStyle,
  chatWrapper,
  topicNameLabelStyle,
  chatArea
} from './styles/Chat.styles';

export type ChatScreenProps = {
  sendBoxMaxLength?: number;
  onRenderAvatar?: (userId: string) => JSX.Element;
};

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { onRenderAvatar, sendBoxMaxLength } = props;

  const pixelToRemConvertRatio = 16;
  const defaultNumberOfChatMessagesToReload = 5;
  const sendBoxParentStyle = mergeStyles({
    maxWidth: sendBoxMaxLength ? `${sendBoxMaxLength / pixelToRemConvertRatio}rem` : 'unset',
    width: '100%'
  });

  const adapter = useAdapter();

  useEffect(() => {
    adapter.fetchInitialData();
  }, [adapter]);

  const messageThreadProps = usePropsFor(MessageThread);
  const participantListProps = usePropsFor(ParticipantList);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);

  return (
    <Stack className={chatContainer} grow>
      <ChatHeader {...headerProps} />
      <Stack className={chatArea} horizontal grow>
        <Stack className={chatWrapper} grow>
          <MessageThread
            {...messageThreadProps}
            onRenderAvatar={onRenderAvatar}
            numberOfChatMessagesToReload={defaultNumberOfChatMessagesToReload}
          />
          <Stack.Item align="center" className={sendBoxParentStyle}>
            <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              <TypingIndicator {...typingIndicatorProps} />
            </div>
            <SendBox {...sendBoxProps} />
          </Stack.Item>
        </Stack>
        <Stack.Item>
          <ParticipantList {...participantListProps} />
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

type HeaderProps = {
  topic: string;
};

const ChatHeader = (props: HeaderProps): JSX.Element => {
  return (
    <Stack className={chatHeaderContainerStyle} horizontal>
      <Stack.Item align="center" style={{ minWidth: '12.5rem' }}>
        <div className={topicNameLabelStyle}>{props.topic}</div>
      </Stack.Item>
    </Stack>
  );
};

const getHeaderProps = (state: ChatClientState, props: ChatBaseSelectorProps): HeaderProps => {
  return {
    topic: state.threads.get(props.threadId)?.properties?.topic || ''
  };
};
