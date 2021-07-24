// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import React, { useEffect, useMemo } from 'react';
import {
  CommunicationParticipant,
  DefaultMessageRendererType,
  ErrorBar,
  MessageProps,
  MessageThread,
  ParticipantList,
  SendBox,
  TypingIndicator
} from '@internal/react-components';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';
import { ChatHeader, getHeaderProps } from './ChatHeader';
import {
  chatContainer,
  chatWrapper,
  chatArea,
  participantListWrapper,
  listHeader,
  participantListStack,
  participantListStyle,
  participantListContainerPadding
} from './styles/Chat.styles';

export type ChatScreenProps = {
  showErrorBar?: boolean;
  showParticipantPane?: boolean;
  showTopic?: boolean;
  onRenderAvatar?: (userId: string, avatarType?: 'chatThread' | 'participantList') => JSX.Element;
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: DefaultMessageRendererType) => JSX.Element;
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;
};

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { onRenderAvatar, onRenderMessage, onRenderTypingIndicator, showParticipantPane, showTopic } = props;

  const defaultNumberOfChatMessagesToReload = 5;
  const sendBoxParentStyle = mergeStyles({ width: '100%' });

  const adapter = useAdapter();

  useEffect(() => {
    adapter.fetchInitialData();
  }, [adapter]);

  const messageThreadProps = usePropsFor(MessageThread);
  const participantListProps = usePropsFor(ParticipantList);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);
  const errorBarProps = usePropsFor(ErrorBar);

  const onRenderMessageAvatar = useMemo(
    () => onRenderAvatar && ((userId: string) => onRenderAvatar(userId, 'chatThread')),
    [onRenderAvatar]
  );

  const onRenderParticipantAvatar = useMemo(
    () =>
      onRenderAvatar &&
      ((participant: CommunicationParticipant) => onRenderAvatar(participant.userId, 'participantList')),
    [onRenderAvatar]
  );

  return (
    <Stack className={chatContainer} grow>
      {!!showTopic && <ChatHeader {...headerProps} />}
      <Stack className={chatArea} tokens={participantListContainerPadding} horizontal grow>
        <Stack className={chatWrapper} grow>
          {props.showErrorBar ? <ErrorBar {...errorBarProps} /> : <></>}
          <MessageThread
            {...messageThreadProps}
            onRenderAvatar={onRenderMessageAvatar}
            onRenderMessage={onRenderMessage}
            numberOfChatMessagesToReload={defaultNumberOfChatMessagesToReload}
          />
          <Stack.Item align="center" className={sendBoxParentStyle}>
            <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              {onRenderTypingIndicator ? (
                onRenderTypingIndicator(typingIndicatorProps.typingUsers)
              ) : (
                <TypingIndicator {...typingIndicatorProps} />
              )}
            </div>
            <SendBox {...sendBoxProps} />
          </Stack.Item>
        </Stack>
        {showParticipantPane && (
          <Stack.Item className={participantListWrapper}>
            <Stack className={participantListStack}>
              <Stack.Item className={listHeader}>In this chat</Stack.Item>
              <Stack.Item className={participantListStyle}>
                <ParticipantList {...participantListProps} onRenderAvatar={onRenderParticipantAvatar} />
              </Stack.Item>
            </Stack>
          </Stack.Item>
        )}
      </Stack>
    </Stack>
  );
};
