// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import {
  CommunicationParticipant,
  MessageRenderer,
  ErrorBar,
  MessageProps,
  MessageThread,
  ParticipantList,
  SendBox,
  TypingIndicator,
  ParticipantMenuItemsCallback
} from '@internal/react-components';
import React, { useCallback, useEffect } from 'react';
import { AvatarPersona, AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { useLocale } from '../localization';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { ChatCompositeHiddenElements } from './ChatComposite';
import { ChatHeader, getHeaderProps } from './ChatHeader';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';
import {
  chatArea,
  chatContainer,
  chatWrapper,
  listHeader,
  participantListContainerPadding,
  participantListStack,
  participantListStyle,
  participantListWrapper
} from './styles/Chat.styles';

export type ChatScreenProps = {
  hiddenElements?: ChatCompositeHiddenElements;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element;
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
};

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const {
    onFetchAvatarPersonaData,
    onRenderMessage,
    onRenderTypingIndicator,
    hiddenElements,
    onFetchParticipantMenuItems
  } = props;

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
      {hiddenElements?.topic !== true && <ChatHeader {...headerProps} />}
      <Stack className={chatArea} tokens={participantListContainerPadding} horizontal grow>
        <Stack className={chatWrapper} grow>
          {hiddenElements?.errorBar !== true && <ErrorBar {...errorBarProps} />}
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
        {hiddenElements?.participantPane !== true && (
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
                  onFetchParticipantMenuItems={onFetchParticipantMenuItems}
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>
        )}
      </Stack>
    </Stack>
  );
};
