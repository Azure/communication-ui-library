// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Text, mergeStyles, IStyle } from '@fluentui/react';
import { ChatMessage as FluentChatMessage, ChatMyMessage } from '@fluentui-contrib/react-chat';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useRef, useState } from 'react';
import {
  chatMessageEditedTagStyle,
  chatMessageDateStyle,
  chatMessageFailedTagStyle,
  chatMessageAuthorStyle
} from '../styles/ChatMessageComponent.styles';
import { formatTimeForChatMessage, formatTimestampForChatMessage } from '../utils/Datetime';
import { useIdentifiers } from '../../identifiers/IdentifierProvider';
import { useTheme } from '../../theming';
import { ChatMessageActionFlyout } from './ChatMessageActionsFlyout';
import { ChatMessageContent } from './ChatMessageContent';
import { ChatMessage } from '../../types/ChatMessage';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { FileMetadata } from '../FileDownloadCards';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessageContent } from './ChatMessageContent';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../types/ChatMessage';
import { MessageThreadStrings } from '../MessageThread';
import { chatMessageActionMenuProps } from './ChatMessageActionMenu';
import { ComponentSlotStyle, OnRenderAvatarCallback } from '../../types';
import { _FileDownloadCards, FileDownloadHandler } from '../FileDownloadCards';
import { ComponentLocale, useLocale } from '../../localization';
/* @conditional-compile-remove(mention) */
import { MentionDisplayOptions } from '../MentionPopover';
import { createStyleFromV8Style } from '../styles/v8StyleShim';
import { MessageStatus } from '@internal/acs-ui-common';
import { mergeClasses } from '@fluentui/react-components';
import {
  useChatMessageStyles,
  useChatMyMessageStyles,
  useChatMessageCommonStyles
} from '../styles/MessageThread.styles';

type ChatMessageComponentAsMessageBubbleProps = {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
  messageContainerStyle?: ComponentSlotStyle;
  /** Styles for message status indicator container. */
  messageStatusContainer?: (mine: boolean) => IStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onEditClick: () => void;
  onRemoveClick?: () => void;
  onResendClick?: () => void;
  strings: MessageThreadStrings;
  userId: string;
  messageStatus?: string;
  /**
   * Whether the status indicator for each message is displayed or not.
   */
  showMessageStatus?: boolean;
  messageStatusRenderer?: (status: MessageStatus) => JSX.Element | null;
  /**
   * Whether to overlap avatar and message when the view is width constrained.
   */
  shouldOverlapAvatarAndMessage: boolean;
  /**
   * Optional callback to render uploaded files in the message component.
   */
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element;
  /**
   * Optional function called when someone clicks on the file download icon.
   */
  fileDownloadHandler?: FileDownloadHandler;
  remoteParticipantsCount?: number;
  onActionButtonClick: (
    message: ChatMessage,
    setMessageReadBy: (readBy: { id: string; displayName: string }[]) => void
  ) => void;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;

  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
  /* @conditional-compile-remove(mention) */
  /**
   * Optional props needed to display suggestions in the mention scenario.
   * @internal
   */
  mentionDisplayOptions?: MentionDisplayOptions;
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  /**
   * Optional function to fetch attachments.
   */
  onFetchAttachments?: (attachment: FileMetadata) => Promise<void>;
  /* @conditional-compile-remove(image-gallery) */
  /**
   * Optional callback called when an inline image is clicked.
   * @beta
   */
  onInlineImageClicked?: (attachmentId: string, messageId: string) => Promise<void>;
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  /**
   * Optional map of attachment ids to blob urls.
   */
  attachmentsMap?: Record<string, string>;
};

const generateDefaultTimestamp = (
  createdOn: Date,
  showDate: boolean | undefined,
  strings: MessageThreadStrings
): string => {
  const formattedTimestamp = showDate
    ? formatTimestampForChatMessage(createdOn, new Date(), strings)
    : formatTimeForChatMessage(createdOn);

  return formattedTimestamp;
};

// onDisplayDateTimeString from props overwrite onDisplayDateTimeString from locale
const generateCustomizedTimestamp = (
  props: ChatMessageComponentAsMessageBubbleProps,
  createdOn: Date,
  locale: ComponentLocale
): string => {
  /* @conditional-compile-remove(date-time-customization) */
  return props.onDisplayDateTimeString
    ? props.onDisplayDateTimeString(createdOn)
    : locale.onDisplayDateTimeString
    ? locale.onDisplayDateTimeString(createdOn)
    : '';

  return '';
};
/** @private */
const MessageBubble = (props: ChatMessageComponentAsMessageBubbleProps): JSX.Element => {
  const ids = useIdentifiers();
  const theme = useTheme();
  const locale = useLocale();

  const {
    userId,
    message,
    onRemoveClick,
    onResendClick,
    disableEditing,
    showDate,
    messageContainerStyle,
    strings,
    onEditClick,
    remoteParticipantsCount = 0,
    onRenderAvatar,
    showMessageStatus,
    messageStatus,
    fileDownloadHandler,
    /* @conditional-compile-remove(image-gallery) */
    onInlineImageClicked,
    shouldOverlapAvatarAndMessage
  } = props;

  const defaultTimeStamp = message.createdOn
    ? generateDefaultTimestamp(message.createdOn, showDate, strings)
    : undefined;

  const customTimestamp = message.createdOn ? generateCustomizedTimestamp(props, message.createdOn, locale) : '';

  const formattedTimestamp = customTimestamp || defaultTimeStamp;

  // Track if the action menu was opened by touch - if so we increase the touch targets for the items
  const [wasInteractionByTouch, setWasInteractionByTouch] = useState(false);
  // `focused` state is used for show/hide actionMenu
  const [focused, setFocused] = React.useState<boolean>(false);

  // The chat message action flyout should target the Chat.Message action menu if clicked,
  // or target the chat message if opened via touch press.
  // Undefined indicates the flyout menu should not be being shown.
  const messageRef = useRef<HTMLDivElement | null>(null);
  const messageActionButtonRef = useRef<HTMLDivElement | null>(null);
  const [chatMessageActionFlyoutTarget, setChatMessageActionFlyoutTarget] = useState<
    React.MutableRefObject<HTMLElement | null> | undefined
  >(undefined);

  const chatActionsEnabled =
    !disableEditing &&
    message.status !== 'sending' &&
    !!message.mine &&
    /* @conditional-compile-remove(data-loss-prevention) */ message.messageType !== 'blocked';
  const [messageReadBy, setMessageReadBy] = useState<{ id: string; displayName: string }[]>([]);

  const actionMenuProps = wasInteractionByTouch
    ? undefined
    : chatMessageActionMenuProps({
        ariaLabel: strings.actionMenuMoreOptions ?? '',
        enabled: chatActionsEnabled,
        menuButtonRef: messageActionButtonRef,
        // Force show the action button while the flyout is open (otherwise this will dismiss when the pointer is hovered over the flyout)
        forceShow: chatMessageActionFlyoutTarget === messageActionButtonRef,
        onActionButtonClick: () => {
          if (message.messageType === 'chat') {
            props.onActionButtonClick(message, setMessageReadBy);
            setChatMessageActionFlyoutTarget(messageActionButtonRef);
          }
        },
        theme
      });

  const onActionFlyoutDismiss = useCallback((): void => {
    // When the flyout dismiss is called, since we control if the action flyout is visible
    // or not we need to set the target to undefined here to actually hide the action flyout
    setChatMessageActionFlyoutTarget(undefined);
  }, [setChatMessageActionFlyoutTarget]);

  const defaultOnRenderFileDownloads = useCallback(
    () => (
      <_FileDownloadCards
        userId={userId}
        fileMetadata={message['attachedFilesMetadata'] || []}
        downloadHandler={fileDownloadHandler}
        /* @conditional-compile-remove(file-sharing) @conditional-compile-remove(teams-inline-images-and-file-sharing)*/
        strings={{ downloadFile: strings.downloadFile, fileCardGroupMessage: strings.fileCardGroupMessage }}
      />
    ),
    [
      userId,
      message,
      /* @conditional-compile-remove(file-sharing) @conditional-compile-remove(teams-inline-images-and-file-sharing)*/
      strings,
      fileDownloadHandler
    ]
  );

  const editedOn = 'editedOn' in message ? message.editedOn : undefined;
  const getMessageDetails = useCallback(() => {
    if (messageStatus === 'failed') {
      return <div className={chatMessageFailedTagStyle(theme)}>{strings.failToSendTag}</div>;
    } else if (message.messageType === 'chat' && editedOn) {
      return <div className={chatMessageEditedTagStyle(theme)}>{strings.editedTag}</div>;
    }
    return undefined;
  }, [editedOn, message.messageType, messageStatus, strings.editedTag, strings.failToSendTag, theme]);

  /* @conditional-compile-remove(image-gallery) */
  const handleOnInlineImageClicked = useCallback(
    async (attachmentId: string): Promise<void> => {
      if (onInlineImageClicked === undefined) {
        return;
      }
      await onInlineImageClicked(attachmentId, message.messageId);
    },
    [message, onInlineImageClicked]
  );

  const getContent = useCallback(() => {
    /* @conditional-compile-remove(data-loss-prevention) */
    if (message.messageType === 'blocked') {
      return (
        <div tabIndex={0}>
          <BlockedMessageContent message={message} strings={strings} />
        </div>
      );
    }
    return (
      <div tabIndex={0} className="ui-chat__message__content">
        <ChatMessageContent
          message={message}
          strings={strings}
          /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
          onFetchAttachment={props.onFetchAttachments}
          /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
          attachmentsMap={props.attachmentsMap}
          /* @conditional-compile-remove(mention) */
          mentionDisplayOptions={props.mentionDisplayOptions}
          /* @conditional-compile-remove(image-gallery) */
          onInlineImageClicked={handleOnInlineImageClicked}
        />
        {props.onRenderFileDownloads ? props.onRenderFileDownloads(userId, message) : defaultOnRenderFileDownloads()}
      </div>
    );
  }, [
    defaultOnRenderFileDownloads,
    message,
    props,
    strings,
    userId,
    /* @conditional-compile-remove(image-gallery) */
    handleOnInlineImageClicked
  ]);

  const isBlockedMessage =
    false || /* @conditional-compile-remove(data-loss-prevention) */ message.messageType === 'blocked';
  const chatMyMessageStyles = useChatMyMessageStyles();
  const chatMessageCommonStyles = useChatMessageCommonStyles();

  const chatMessageStyles = useChatMessageStyles();
  const chatItemMessageContainerClassName = mergeClasses(
    // messageContainerStyle used in className and style prop as style prop can't handle CSS selectors
    chatMessageStyles.body,
    isBlockedMessage
      ? chatMessageCommonStyles.blocked
      : props.message.status === 'failed'
      ? chatMessageCommonStyles.failed
      : undefined,
    shouldOverlapAvatarAndMessage ? chatMessageStyles.avatarOverlap : chatMessageStyles.avatarNoOverlap,
    message.attached === 'top' || message.attached === false
      ? chatMessageStyles.bodyWithAvatar
      : chatMessageStyles.bodyWithoutAvatar,
    mergeStyles(messageContainerStyle)
  );

  const attached = message.attached === true ? 'center' : message.attached === 'bottom' ? 'bottom' : 'top';
  const chatMessage = (
    <>
      <div key={props.message.messageId} ref={messageRef}>
        {message.mine ? (
          <ChatMyMessage
            key={props.message.messageId}
            body={{
              // messageContainerStyle used in className and style prop as style prop can't handle CSS selectors
              className: mergeClasses(
                chatMyMessageStyles.body,
                isBlockedMessage
                  ? chatMessageCommonStyles.blocked
                  : props.message.status === 'failed'
                  ? chatMessageCommonStyles.failed
                  : undefined,
                mergeStyles(messageContainerStyle)
              ),
              style: { ...createStyleFromV8Style(messageContainerStyle) },
              tabIndex: -1,
              role: 'presentation'
            }}
            root={{
              className: chatMyMessageStyles.root,
              onBlur: (e) => {
                // copy behavior from North*
                // `focused` controls is focused the whole `ChatMessage` or any of its children. When we're navigating
                // with keyboard the focused element will be changed and there is no way to use `:focus` selector
                const shouldPreserveFocusState = e.currentTarget.contains(e.relatedTarget);

                setFocused(shouldPreserveFocusState);
              },
              onFocus: () => {
                // copy behavior from North*
                // react onFocus is called even when nested component receives focus (i.e. it bubbles)
                // so when focus moves within actionMenu, the `focus` state in chatMessage remains true, and keeps actionMenu visible
                setFocused(true);
              },
              role: 'none',
              tabIndex: -1
            }}
            data-ui-id="chat-composite-message"
            author={
              <Text className={chatMessageDateStyle} tabIndex={0}>
                {message.senderDisplayName}
              </Text>
            }
            timestamp={
              <Text className={chatMessageDateStyle} data-ui-id={ids.messageTimestamp} tabIndex={0}>
                {formattedTimestamp}
              </Text>
            }
            details={getMessageDetails()}
            actions={{
              children: actionMenuProps?.children,
              className: mergeClasses(
                chatMyMessageStyles.menu,
                // Make actions menu visible when the message is focused or the flyout is shown
                focused || chatMessageActionFlyoutTarget
                  ? chatMyMessageStyles.menuVisible
                  : chatMyMessageStyles.menuHidden
              )
            }}
            onTouchStart={() => setWasInteractionByTouch(true)}
            onPointerDown={() => setWasInteractionByTouch(false)}
            onKeyDown={() => setWasInteractionByTouch(false)}
            onBlur={() => setWasInteractionByTouch(false)} // onBlur is applied to body, not root
            onClick={() => {
              if (!wasInteractionByTouch) {
                return;
              }
              // If the message was touched via touch we immediately open the menu
              // flyout (when using mouse the 3-dot menu that appears on hover
              // must be clicked to open the flyout).
              // In doing so here we set the target of the flyout to be the message and
              // not the 3-dot menu button to position the flyout correctly.
              setChatMessageActionFlyoutTarget(messageRef);
              if (message.messageType === 'chat') {
                props.onActionButtonClick(message, setMessageReadBy);
              }
            }}
          >
            {getContent()}
          </ChatMyMessage>
        ) : (
          <FluentChatMessage
            attached={attached}
            key={props.message.messageId}
            root={{ className: chatMessageStyles.root }}
            author={<Text className={chatMessageAuthorStyle}>{message.senderDisplayName}</Text>}
            body={{
              className: chatItemMessageContainerClassName,
              style: { ...createStyleFromV8Style(messageContainerStyle) },
              // make body not focusable to remove repetitions from narrators.
              // inner components are already focusable
              tabIndex: -1,
              role: 'none'
            }}
            data-ui-id="chat-composite-message"
            timestamp={
              <Text className={chatMessageDateStyle} data-ui-id={ids.messageTimestamp}>
                {formattedTimestamp}
              </Text>
            }
          >
            {getContent()}
          </FluentChatMessage>
        )}
      </div>
      {chatActionsEnabled && (
        <ChatMessageActionFlyout
          hidden={!chatMessageActionFlyoutTarget}
          target={chatMessageActionFlyoutTarget}
          increaseFlyoutItemSize={wasInteractionByTouch}
          onDismiss={onActionFlyoutDismiss}
          onEditClick={onEditClick}
          onRemoveClick={onRemoveClick}
          onResendClick={onResendClick}
          strings={strings}
          messageReadBy={messageReadBy}
          messageStatus={messageStatus ?? 'failed'}
          remoteParticipantsCount={remoteParticipantsCount}
          onRenderAvatar={onRenderAvatar}
          showMessageStatus={showMessageStatus}
        />
      )}
    </>
  );
  return chatMessage;
};

/** @private */
export const ChatMessageComponentAsMessageBubble = React.memo(MessageBubble);
