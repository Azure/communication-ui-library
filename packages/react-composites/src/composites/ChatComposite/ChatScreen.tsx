// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { MessageThread, ParticipantList, SendBox, TypingIndicator } from 'react-components';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';
import { ChatHeader, getHeaderProps } from './ChatHeader';
import { ThreadStatus, getThreadStatusProps } from './ThreadStatus';
import {
  chatContainer,
  chatWrapper,
  chatArea,
  participantListWrapper,
  listHeader,
  participantListStack,
  participantListStyle
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
  const threadStatusProps = useAdaptedSelector(getThreadStatusProps);

  return (
    <Stack className={chatContainer} grow>
      <ChatHeader {...headerProps} />
      <Stack className={chatArea} horizontal grow>
        <Stack className={chatWrapper} grow>
          <ThreadStatus {...threadStatusProps} />
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
        <Stack.Item className={participantListWrapper}>
          <Stack className={participantListStack}>
            <Stack.Item className={listHeader}>In this chat</Stack.Item>
            <Stack.Item className={participantListStyle}>
              <ParticipantList {...participantListProps} />
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};
