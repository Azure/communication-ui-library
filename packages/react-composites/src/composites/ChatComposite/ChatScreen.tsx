// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import {
  CommunicationParticipant,
  ErrorBar,
  MessageProps,
  MessageRenderer,
  MessageThread,
  MessageThreadStyles,
  ParticipantMenuItemsCallback,
  SendBox,
  SendBoxStylesProps,
  TypingIndicator,
  TypingIndicatorStylesProps
} from '@internal/react-components';
import React, { useCallback, useEffect } from 'react';
import { AvatarPersona, AvatarPersonaDataCallback } from '../common/AvatarPersona';

import { useAdapter } from './adapter/ChatAdapterProvider';
import { ChatCompositeOptions } from './ChatComposite';
import { ChatHeader, getHeaderProps } from './ChatHeader';
import { FileUploadButtonWrapper as FileUploadButton } from './file-sharing/FileUploadButton';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';

import {
  chatArea,
  chatContainer,
  chatWrapper,
  messageThreadChatCompositeStyles,
  sendboxContainerStyles,
  typingIndicatorContainerStyles
} from './styles/Chat.styles';

/* @conditional-compile-remove-from(stable) */
import { ParticipantContainer } from '../common/ParticipantContainer';
/* @conditional-compile-remove-from(stable) */
import { useLocale } from '../localization';
import { participantListContainerPadding } from '../common/styles/ParticipantContainer.styles';
/* @conditional-compile-remove-from(stable) */
import { ParticipantList } from '@internal/react-components';
import { FileUploadHandler } from './file-sharing/FileUploadHandler';

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
  hasFocusOnMount?: 'sendBoxTextField' | false;
  fileUploadAccept?: string;
  fileUploadMultiple?: boolean;
  fileUploadHandler?: FileUploadHandler;
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
    options,
    styles,
    fileUploadAccept,
    fileUploadHandler,
    fileUploadMultiple
  } = props;

  const defaultNumberOfChatMessagesToReload = 5;

  const adapter = useAdapter();

  /* @conditional-compile-remove-from(stable) */
  const locale = useLocale();
  /* @conditional-compile-remove-from(stable) */
  const chatListHeader = locale.strings.chat.chatListHeader;

  useEffect(() => {
    adapter.fetchInitialData();
  }, [adapter]);

  const messageThreadProps = usePropsFor(MessageThread);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);
  const errorBarProps = usePropsFor(ErrorBar);
  /* @conditional-compile-remove-from(stable) */
  const participantListProps = usePropsFor(ParticipantList);

  const onRenderAvatarCallback = useCallback(
    (userId, defaultOptions) => {
      return (
        <AvatarPersona
          userId={userId}
          hidePersonaDetails={true}
          {...defaultOptions}
          dataProvider={onFetchAvatarPersonaData}
        />
      );
    },
    [onFetchAvatarPersonaData]
  );

  const messageThreadStyles = Object.assign({}, messageThreadChatCompositeStyles, styles?.messageThread);
  const typingIndicatorStyles = Object.assign({}, styles?.typingIndicator);
  const sendBoxStyles = Object.assign({}, styles?.sendBox);

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
            styles={messageThreadStyles}
          />
          <Stack className={mergeStyles(sendboxContainerStyles)}>
            <div className={mergeStyles(typingIndicatorContainerStyles)}>
              {onRenderTypingIndicator ? (
                onRenderTypingIndicator(typingIndicatorProps.typingUsers)
              ) : (
                <TypingIndicator {...typingIndicatorProps} styles={typingIndicatorStyles} />
              )}
            </div>
            <SendBox {...sendBoxProps} autoFocus={options?.autoFocus} styles={sendBoxStyles} />
            <FileUploadButton
              accept={fileUploadAccept}
              multiple={fileUploadMultiple}
              fileUploadHandler={fileUploadHandler}
            />
          </Stack>
        </Stack>
        {
          /* @conditional-compile-remove-from(stable) */
          options?.participantPane === true && (
            <ParticipantContainer
              participantListProps={participantListProps}
              onFetchAvatarPersonaData={onFetchAvatarPersonaData}
              onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
              title={chatListHeader}
            />
          )
        }
      </Stack>
    </Stack>
  );
};
