// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageStatus, _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useMemo } from 'react';
import { MessageProps, MessageRenderer, _ChatMessageProps } from '../MessageThread';
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

type FluentChatMessageComponentWrapperProps = ChatMessageComponentWrapperProps & {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
};

/**
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
    onDisplayDateTimeString,
    onFetchInlineAttachment,
    onInlineImageClicked,
    inlineAttachments,
    mentionOptions,
    userId,
    onRenderFileDownloads,
    defaultStatusRenderer,
    statusToRender
  } = props;
  const chatMessageRenderStyles = useChatMessageRenderStyles();

  const onRenderFileDownloadsMemo = useMemo(() => {
    /* @conditional-compile-remove(file-sharing) */
    return onRenderFileDownloads;
    return undefined;
  }, [onRenderFileDownloads]);

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
          />
        );
      }
      return <></>;
    },
    [
      inlineAttachments,
      mentionOptions,
      onActionButtonClick,
      onDisplayDateTimeString,
      onFetchInlineAttachment,
      onInlineImageClicked,
      onRenderAvatar,
      onRenderFileDownloadsMemo,
      participantCount,
      shouldOverlapAvatarAndMessage,
      showMessageStatus,
      userId
    ]
  );

  const messageRenderer = useCallback(
    (
      messageProps: MessageProps,
      defaultChatMessageRenderer: (messageProps: MessageProps) => React.JSX.Element,
      onRenderMessage?: (messageProps: MessageProps, messageRenderer?: MessageRenderer) => JSX.Element
    ) => {
      //TODO: check if there should be dependencies
      /// check if it can be just func outside of component
      return onRenderMessage === undefined
        ? defaultChatMessageRenderer({ ...messageProps })
        : onRenderMessage(messageProps, defaultChatMessageRenderer);
    },
    []
  );

  const messageStatusRenderer = useCallback(
    (
      onRenderMessageStatus:
        | ((messageStatusIndicatorProps: MessageStatusIndicatorProps) => JSX.Element | null)
        | undefined,
      defaultStatusRenderer: (
        message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
        status: MessageStatus,
        participantCount: number,
        readCount: number
      ) => JSX.Element,
      showMessageStatus?: boolean,
      participantCount?: number,
      readCount?: number
    ) => {
      return showMessageStatus && statusToRender ? (
        onRenderMessageStatus ? (
          onRenderMessageStatus({ status: statusToRender })
        ) : (
          defaultStatusRenderer(message, statusToRender, participantCount ?? 0, readCount ?? 0)
        )
      ) : (
        <div className={mergeStyles(noMessageStatusStyle)} />
      );
    },
    [message, statusToRender]
  );

  // let chatMessageComponent: JSX.Element;
  const shouldShowAvatar = useMemo(() => {
    return message.attached === 'top' || message.attached === false;
  }, [message.attached]);

  const attached = useMemo(() => {
    return shouldShowAvatar ? 'top' : 'center';
  }, [shouldShowAvatar]);

  // Fluent UI message components are used here as
  // for default message renderer, timestamp and author name should be shown but
  // they aren't shown for custom render.
  // More investigations are needed to check if this can be simplified with states.
  // Status and avatar should be shown for custom and default renderers.
  if (message.mine === true) {
    return (
      <div>
        <FluentChatMyMessage
          attached={attached}
          root={{
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
          }}
          body={{
            className: mergeClasses(chatMessageRenderStyles.bodyCommon, chatMessageRenderStyles.bodyMyMessage),
            // make body not focusable to remove repetitions from narrators.
            // inner components are already focusable
            tabIndex: -1,
            role: 'none'
          }}
          statusIcon={
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
          }
        >
          {messageRenderer({ ...props }, defaultChatMessageRenderer, onRenderMessage)}
        </FluentChatMyMessage>
      </div>
    );
  } else {
    const chatAvatarStyle = shouldShowAvatar ? gutterWithAvatar : gutterWithHiddenAvatar;
    const personaOptions: IPersona = {
      hidePersonaDetails: true,
      size: PersonaSize.size32,
      text: message.senderDisplayName,
      showOverflowTooltip: false
    };
    return (
      <div>
        <FluentChatMessage
          attached={attached}
          root={{ className: mergeClasses(chatMessageRenderStyles.rootMessage, chatMessageRenderStyles.rootCommon) }}
          body={{
            // chatItemMessageContainer used in className and style prop as style prop can't handle CSS selectors
            className: mergeClasses(
              chatMessageRenderStyles.bodyCommon,
              !shouldShowAvatar ? chatMessageRenderStyles.bodyWithoutAvatar : chatMessageRenderStyles.bodyWithAvatar,
              shouldOverlapAvatarAndMessage
                ? chatMessageRenderStyles.avatarOverlap
                : chatMessageRenderStyles.avatarNoOverlap,
              mergeStyles(styles?.chatItemMessageContainer)
            ),
            style:
              styles?.chatItemMessageContainer !== undefined
                ? createStyleFromV8Style(styles?.chatItemMessageContainer)
                : {},
            // make body not focusable to remove repetitions from narrators.
            // inner components are already focusable
            tabIndex: -1,
            role: 'none'
          }}
          avatar={
            <div className={mergeStyles(chatAvatarStyle)}>
              {onRenderAvatar ? onRenderAvatar?.(message.senderId, personaOptions) : <Persona {...personaOptions} />}
            </div>
          }
        >
          {messageRenderer({ ...props }, defaultChatMessageRenderer, onRenderMessage)}
        </FluentChatMessage>
      </div>
    );
  }
};
