// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import {
  CommunicationParticipant,
  ErrorBar,
  MessageProps,
  MessageRenderer,
  MessageThread,
  ParticipantList,
  SendBox,
  TypingIndicator,
  ParticipantMenuItemsCallback,
  MessageThreadStyles,
  SendBoxStylesProps,
  TypingIndicatorStylesProps
} from '@internal/react-components';
import React, { useCallback, useEffect } from 'react';
import { AvatarPersona, AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { useLocale } from '../localization';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { ChatCompositeOptions } from './ChatComposite';
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

/**
 * @private
 */
export type ChatScreenProps = {
  options?: ChatCompositeOptions;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element;
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  styles?: ChatScreenStyles;
};

/**
 * @private
 */
export type ChatScreenStyles = {
  messageThread?: MessageThreadStyles;
  sendBox?: SendBoxStylesProps;
  typingIndicator?: TypingIndicatorStylesProps;
};

/**
 * @private
 */
export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const {
    onFetchAvatarPersonaData,
    onRenderMessage,
    onRenderTypingIndicator,
    onFetchParticipantMenuItems,
    options,
    styles
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
    (userId, defaultOptions) => {
      return <AvatarPersona userId={userId} {...defaultOptions} dataProvider={onFetchAvatarPersonaData} />;
    },
    [onFetchAvatarPersonaData]
  );

  return (
    <Stack className={chatContainer} grow>
      {options?.topic !== false && <ChatHeader {...headerProps} />}
      <Stack className={chatArea} tokens={participantListContainerPadding} horizontal grow>
        <Stack className={chatWrapper} grow>
          {options?.errorBar !== false && <ErrorBar {...errorBarProps} />}
          <MessageThread
            {...messageThreadProps}
            onRenderAvatar={onRenderAvatarCallback}
            onRenderMessage={onRenderMessage}
            numberOfChatMessagesToReload={defaultNumberOfChatMessagesToReload}
            styles={styles?.messageThread}
          />
          <Stack.Item align="center" className={sendBoxParentStyle}>
            <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
              {onRenderTypingIndicator ? (
                onRenderTypingIndicator(typingIndicatorProps.typingUsers)
              ) : (
                <TypingIndicator {...typingIndicatorProps} styles={styles?.typingIndicator} />
              )}
            </div>
            <SendBox {...sendBoxProps} styles={styles?.sendBox} />
          </Stack.Item>
        </Stack>
        {options?.participantPane !== false && (
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
