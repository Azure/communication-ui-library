// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import React, { useCallback, useEffect } from 'react';
import {
  CommunicationParticipant,
  MessageRenderer,
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
import { AvatarPersonaDataCallback, AvatarPersona } from '../common/AvatarPersona';
import { useLocale } from '../localization';

export type ChatScreenProps = {
  showErrorBar?: boolean;
  showParticipantPane?: boolean;
  showTopic?: boolean;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element;
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;
};

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { onFetchAvatarPersonaData, onRenderMessage, onRenderTypingIndicator, showParticipantPane, showTopic } = props;

  const defaultNumberOfChatMessagesToReload = 5;
  const sendBoxParentStyle = mergeStyles({ width: '100%' });

  const adapter = useAdapter();

  useEffect(() => {
    adapter.fetchInitialData();
  }, [adapter]);

  const locale = useLocale();
  const chatListHeader = locale.strings.chat.chatListHeader;

  const messageThreadProps = usePropsFor(MessageThread);
  const participantListProps = usePropsFor(ParticipantList);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);
  const errorBarProps = usePropsFor(ErrorBar);

  const onRenderAvatarCallback = useCallback(
    (userId, options) => {
      return <AvatarPersona userId={userId} {...options} dataProvider={onFetchAvatarPersonaData} />;
    },
    [onFetchAvatarPersonaData]
  );

  return (
    <Stack className={chatContainer} grow>
      {!!showTopic && <ChatHeader {...headerProps} />}
      <Stack className={chatArea} tokens={participantListContainerPadding} horizontal grow>
        <Stack className={chatWrapper} grow>
          {props.showErrorBar ? <ErrorBar {...errorBarProps} /> : <></>}
          <MessageThread
            {...messageThreadProps}
            onRenderAvatar={onRenderAvatarCallback}
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
              <Stack.Item className={listHeader}>{chatListHeader}</Stack.Item>
              <Stack.Item className={participantListStyle}>
                <ParticipantList
                  {...participantListProps}
                  onRenderAvatar={(userId, options) => (
                    <AvatarPersona
                      data-ui-id="chat-composite-participant-custom-avatar"
                      userId={userId}
                      {...options}
                      dataProvider={onFetchAvatarPersonaData}
                    />
                  )}
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>
        )}
      </Stack>
    </Stack>
  );
};
