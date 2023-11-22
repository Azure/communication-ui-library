// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageStatus, _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useMemo } from 'react';
import { MessageProps, _ChatMessageProps } from '../MessageThread';
import { ChatMessage } from '../../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../types';
import {
  gutterWithAvatar,
  gutterWithHiddenAvatar,
  noMessageStatusStyle,
  useChatMessageRenderStyles
} from '../styles/MessageThread.styles';
import { IPersona, PersonaSize, mergeStyles, Persona } from '@fluentui/react';
import { mergeClasses } from '@fluentui/react-components';
import { createStyleFromV8Style } from '../styles/v8StyleShim';
import { MessageStatusIndicatorProps } from '../MessageStatusIndicator';
import { ChatMessageComponentWrapperProps } from './ChatMessageComponentWrapper';
import { ChatMessageComponent } from './ChatMessageComponent';
import { ChatMessage as FluentChatMessage, ChatMyMessage as FluentChatMyMessage } from '@fluentui-contrib/react-chat';

/**
 * Props for {@link FluentChatMessageComponentWrapper}
 *
 * @private
 */
type FluentChatMessageComponentWrapperProps = ChatMessageComponentWrapperProps & {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
};

/**
 * The component for rendering a chat message using Fluent UI components
 * and handling default and custom renderers.
 * This component handles rendering for chat message body, avatar and message status.
 * The chat message body, avatar and message status should be shown for both default and custom renderers.
 *
 * @private
 */
export const FluentChatMessageComponentWrapper = (props: FluentChatMessageComponentWrapperProps): JSX.Element => {
  const {
    message,
    styles,
    shouldOverlapAvatarAndMessage,
    onRenderMessage,
    onRenderAvatar,
    showMessageStatus,
    onRenderMessageStatus,
    participantCount,
    readCount,
    onActionButtonClick,
    /* @conditional-compile-remove(date-time-customization) */
    onDisplayDateTimeString,
    /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
    onFetchInlineAttachment,
    /* @conditional-compile-remove(image-gallery) */
    onInlineImageClicked,
    /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
    inlineAttachments,
    /* @conditional-compile-remove(mention) */
    mentionOptions,
    /* @conditional-compile-remove(file-sharing) */
    fileDownloadHandler,
    userId,
    /* @conditional-compile-remove(file-sharing) */
    onRenderFileDownloads,
    defaultStatusRenderer,
    statusToRender
  } = props;
  const chatMessageRenderStyles = useChatMessageRenderStyles();

  const onRenderFileDownloadsMemo = useMemo(() => {
    /* @conditional-compile-remove(file-sharing) */
    return onRenderFileDownloads;
    return undefined;
  }, [/* @conditional-compile-remove(file-sharing) */ onRenderFileDownloads]);

  // To rerender the defaultChatMessageRenderer if app running across days(every new day chat time stamp need to be regenerated)
  const defaultChatMessageRenderer = useCallback(
    (messageProps: MessageProps) => {
      if (
        messageProps.message.messageType === 'chat' ||
        /* @conditional-compile-remove(data-loss-prevention) */ messageProps.message.messageType === 'blocked'
      ) {
        return (
          <ChatMessageComponent
            {...messageProps}
            /* @conditional-compile-remove(file-sharing) */
            onRenderFileDownloads={onRenderFileDownloadsMemo}
            /* @conditional-compile-remove(file-sharing) */
            strings={messageProps.strings}
            message={messageProps.message}
            userId={userId}
            remoteParticipantsCount={participantCount ? participantCount - 1 : 0}
            shouldOverlapAvatarAndMessage={shouldOverlapAvatarAndMessage}
            onRenderAvatar={onRenderAvatar}
            showMessageStatus={showMessageStatus}
            messageStatus={messageProps.message.status}
            onActionButtonClick={onActionButtonClick}
            /* @conditional-compile-remove(date-time-customization) */
            onDisplayDateTimeString={onDisplayDateTimeString}
            /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
            onFetchAttachments={onFetchInlineAttachment}
            /* @conditional-compile-remove(image-gallery) */
            onInlineImageClicked={onInlineImageClicked}
            /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
            attachmentsMap={inlineAttachments[messageProps.message.messageId] ?? {}}
            /* @conditional-compile-remove(mention) */
            mentionOptions={mentionOptions}
            /* @conditional-compile-remove(file-sharing) */
            fileDownloadHandler={fileDownloadHandler}
          />
        );
      }
      return <></>;
    },
    [
      onActionButtonClick,
      onRenderAvatar,
      onRenderFileDownloadsMemo,
      participantCount,
      shouldOverlapAvatarAndMessage,
      showMessageStatus,
      userId,
      /* @conditional-compile-remove(date-time-customization) */
      onDisplayDateTimeString,
      /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
      onFetchInlineAttachment,
      /* @conditional-compile-remove(image-gallery) */
      onInlineImageClicked,
      /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
      inlineAttachments,
      /* @conditional-compile-remove(mention) */
      mentionOptions,
      /* @conditional-compile-remove(file-sharing) */
      fileDownloadHandler
    ]
  );

  const messageRenderer = useCallback(
    (messageProps: MessageProps) => {
      return onRenderMessage === undefined
        ? defaultChatMessageRenderer({ ...messageProps })
        : onRenderMessage(messageProps, defaultChatMessageRenderer);
    },
    [defaultChatMessageRenderer, onRenderMessage]
  );

  const messageStatusRenderer = useCallback(
    (
      onRenderMessageStatus:
        | ((messageStatusIndicatorProps: MessageStatusIndicatorProps) => JSX.Element | null)
        | undefined,
      defaultStatusRenderer: (
        message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
        participantCount: number,
        readCount: number,
        status?: MessageStatus
      ) => JSX.Element,
      showMessageStatus?: boolean,
      participantCount?: number,
      readCount?: number
    ) => {
      return showMessageStatus && statusToRender ? (
        onRenderMessageStatus ? (
          onRenderMessageStatus({ status: message.status })
        ) : (
          defaultStatusRenderer(message, participantCount ?? 0, readCount ?? 0, message.status)
        )
      ) : (
        <div className={mergeStyles(noMessageStatusStyle)} />
      );
    },
    [message, statusToRender]
  );

  const shouldShowAvatar = useMemo(() => {
    return message.attached === 'top' || message.attached === false;
  }, [message.attached]);

  const attached = useMemo(() => {
    return shouldShowAvatar ? 'top' : 'center';
  }, [shouldShowAvatar]);

  const myMessageRootProps = useMemo(() => {
    return {
      // myChatItemMessageContainer used in className and style prop as style prop can't handle CSS selectors
      className: mergeClasses(
        chatMessageRenderStyles.rootMyMessage,
        chatMessageRenderStyles.rootCommon,
        mergeStyles(styles?.myChatItemMessageContainer)
      ),
      style:
        styles?.myChatItemMessageContainer !== undefined
          ? createStyleFromV8Style(styles?.myChatItemMessageContainer)
          : {},
      role: 'none'
    };
  }, [chatMessageRenderStyles.rootCommon, chatMessageRenderStyles.rootMyMessage, styles?.myChatItemMessageContainer]);

  const myMessageBodyProps = useMemo(() => {
    return {
      className: mergeClasses(chatMessageRenderStyles.bodyCommon, chatMessageRenderStyles.bodyMyMessage),
      // make body not focusable to remove repetitions from narrators.
      // inner components are already focusable
      tabIndex: -1,
      role: 'none'
    };
  }, [chatMessageRenderStyles.bodyCommon, chatMessageRenderStyles.bodyMyMessage]);

  const myMessageStatusIcon = useMemo(() => {
    return (
      <div
        className={mergeStyles(
          { paddingLeft: '0.25rem' },
          styles?.messageStatusContainer ? styles.messageStatusContainer(message.mine ?? false) : ''
        )}
      >
        {message.status
          ? messageStatusRenderer(
              onRenderMessageStatus,
              defaultStatusRenderer,
              showMessageStatus,
              participantCount,
              readCount
            )
          : undefined}
      </div>
    );
  }, [
    defaultStatusRenderer,
    message.mine,
    message.status,
    messageStatusRenderer,
    onRenderMessageStatus,
    participantCount,
    readCount,
    showMessageStatus,
    styles
  ]);

  const messageRootProps = useMemo(() => {
    return { className: mergeClasses(chatMessageRenderStyles.rootMessage, chatMessageRenderStyles.rootCommon) };
  }, [chatMessageRenderStyles.rootCommon, chatMessageRenderStyles.rootMessage]);

  const messageBodyProps = useMemo(() => {
    return {
      // chatItemMessageContainer used in className and style prop as style prop can't handle CSS selectors
      className: mergeClasses(
        chatMessageRenderStyles.bodyCommon,
        !shouldShowAvatar ? chatMessageRenderStyles.bodyWithoutAvatar : chatMessageRenderStyles.bodyWithAvatar,
        shouldOverlapAvatarAndMessage ? chatMessageRenderStyles.avatarOverlap : chatMessageRenderStyles.avatarNoOverlap,
        mergeStyles(styles?.chatItemMessageContainer)
      ),
      style:
        styles?.chatItemMessageContainer !== undefined ? createStyleFromV8Style(styles?.chatItemMessageContainer) : {},
      // make body not focusable to remove repetitions from narrators.
      // inner components are already focusable
      tabIndex: -1,
      role: 'none'
    };
  }, [
    chatMessageRenderStyles.avatarNoOverlap,
    chatMessageRenderStyles.avatarOverlap,
    chatMessageRenderStyles.bodyCommon,
    chatMessageRenderStyles.bodyWithAvatar,
    chatMessageRenderStyles.bodyWithoutAvatar,
    shouldOverlapAvatarAndMessage,
    shouldShowAvatar,
    styles?.chatItemMessageContainer
  ]);

  const avatar = useMemo(() => {
    const chatAvatarStyle = shouldShowAvatar ? gutterWithAvatar : gutterWithHiddenAvatar;
    const personaOptions: IPersona = {
      hidePersonaDetails: true,
      size: PersonaSize.size32,
      text: message.senderDisplayName,
      showOverflowTooltip: false
    };
    return (
      <div className={mergeStyles(chatAvatarStyle)}>
        {onRenderAvatar ? onRenderAvatar?.(message.senderId, personaOptions) : <Persona {...personaOptions} />}
      </div>
    );
  }, [message.senderDisplayName, message.senderId, onRenderAvatar, shouldShowAvatar]);

  // Fluent UI message components are used here as for default message renderer,
  // timestamp and author name should be shown but they aren't shown for custom renderer.
  // More investigations are needed to check if this can be simplified with states.
  // Status and avatar should be shown for both custom and default renderers.
  if (message.mine === true) {
    return (
      <div>
        <FluentChatMyMessage
          attached={attached}
          root={myMessageRootProps}
          body={myMessageBodyProps}
          statusIcon={myMessageStatusIcon}
        >
          {messageRenderer({ ...props })}
        </FluentChatMyMessage>
      </div>
    );
  } else {
    return (
      <div>
        <FluentChatMessage attached={attached} root={messageRootProps} body={messageBodyProps} avatar={avatar}>
          {messageRenderer({ ...props })}
        </FluentChatMessage>
      </div>
    );
  }
};
