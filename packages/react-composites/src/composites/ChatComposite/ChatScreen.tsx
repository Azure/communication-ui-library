// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { ChatClientState } from 'chat-stateful-client';
import * as reselect from 'reselect';
import { ChatBaseSelectorProps } from '@azure/acs-chat-selector';
import { ChatParticipant } from '@azure/communication-chat';
import { MessageThread, ParticipantList, SendBox, TypingIndicator } from 'react-components';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';
import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import {
  chatContainer,
  chatHeaderContainerStyle,
  chatWrapper,
  topicNameLabelStyle,
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
        <ThreadStatus {...threadStatusProps} />
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

type ThreadStatusProps = {
  amIRemovedFromThread: boolean;
};

const ThreadStatus = (props: ThreadStatusProps): JSX.Element => {
  return (
    <>
      {props.amIRemovedFromThread ? (
        <div>
          <h1>You have been kicked</h1>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

// TODO: Consider exporting building-block selectors internally to composites.
// This will avoid code duplication but still keep the public API clean.
export const getUserId = (state: ChatClientState): string => toFlatCommunicationIdentifier(state.userId);

// TODO: Consider exporting building-block selectors internally to composites.
// This will avoid code duplication but still keep the public API clean.
export const getParticipants = (state: ChatClientState, props: ChatBaseSelectorProps): Map<string, ChatParticipant> =>
  (props.threadId && state.threads.get(props.threadId)?.participants) || new Map();

const getThreadStatusProps = reselect.createSelector(
  [getUserId, getParticipants],
  (userId, chatParticipants: Map<string, ChatParticipant>): ThreadStatusProps => {
    return {
      amIRemovedFromThread: !chatParticipants.has(userId)
    };
  }
);
