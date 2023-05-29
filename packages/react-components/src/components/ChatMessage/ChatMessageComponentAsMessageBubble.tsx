// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import { Chat, Text } from '@internal/northstar-wrapper';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useRef, useState } from 'react';
import {
  chatMessageEditedTagStyle,
  chatMessageDateStyle,
  chatMessageFailedTagStyle
} from '../styles/ChatMessageComponent.styles';
import { formatTimeForChatMessage, formatTimestampForChatMessage } from '../utils/Datetime';
import { useIdentifiers } from '../../identifiers/IdentifierProvider';
import { useTheme } from '../../theming';
import { ChatMessageActionFlyout } from './ChatMessageActionsFlyout';
import { ChatMessageContent } from './ChatMessageContent';
import { ChatMessage } from '../../types/ChatMessage';
/* @conditional-compile-remove(teams-inline-images) */
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

type ChatMessageComponentAsMessageBubbleProps = {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
  messageContainerStyle?: ComponentSlotStyle;
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
  /* @conditional-compile-remove(teams-inline-images) */
  /**
   * Optional function to fetch attachments.
   */
  onFetchAttachments?: (attachment: FileMetadata) => Promise<void>;
  /* @conditional-compile-remove(teams-inline-images) */
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
    fileDownloadHandler
  } = props;

  const defaultTimeStamp = message.createdOn
    ? generateDefaultTimestamp(message.createdOn, showDate, strings)
    : undefined;

  const customTimestamp = message.createdOn ? generateCustomizedTimestamp(props, message.createdOn, locale) : '';

  const formattedTimestamp = customTimestamp || defaultTimeStamp;

  // Track if the action menu was opened by touch - if so we increase the touch targets for the items
  const [wasInteractionByTouch, setWasInteractionByTouch] = useState(false);

  // The chat message action flyout should target the Chat.Message action menu if clicked,
  // or target the chat message if opened via touch press.
  // Undefined indicates the flyout menu should not be being shown.
  const messageRef = useRef<HTMLDivElement | null>(null);
  const messageActionButtonRef = useRef<HTMLElement | null>(null);
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
        /* @conditional-compile-remove(file-sharing) */
        strings={{ downloadFile: props.strings.downloadFile ?? locale.strings.messageThread.downloadFile }}
      />
    ),
    [
      userId,
      message,
      /* @conditional-compile-remove(file-sharing) */
      props,
      /* @conditional-compile-remove(file-sharing) */
      locale,
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
      <div tabIndex={0}>
        <ChatMessageContent
          message={message}
          strings={strings}
          /* @conditional-compile-remove(teams-inline-images) */
          onFetchAttachment={props.onFetchAttachments}
          /* @conditional-compile-remove(teams-inline-images) */
          attachmentsMap={props.attachmentsMap}
          /* @conditional-compile-remove(mention) */
          mentionDisplayOptions={props.mentionDisplayOptions}
        />
        {props.onRenderFileDownloads ? props.onRenderFileDownloads(userId, message) : defaultOnRenderFileDownloads()}
      </div>
    );
  }, [defaultOnRenderFileDownloads, message, props, strings, userId]);

  const chatMessage = (
    <>
      <div ref={messageRef}>
        <Chat.Message
          data-ui-id="chat-composite-message"
          className={mergeStyles(messageContainerStyle as IStyle)}
          styles={messageContainerStyle}
          content={getContent()}
          author={<Text className={chatMessageDateStyle}>{message.senderDisplayName}</Text>}
          mine={message.mine}
          timestamp={<Text data-ui-id={ids.messageTimestamp}>{formattedTimestamp}</Text>}
          details={getMessageDetails()}
          positionActionMenu={false}
          actionMenu={actionMenuProps}
          onTouchStart={() => setWasInteractionByTouch(true)}
          onPointerDown={() => setWasInteractionByTouch(false)}
          onKeyDown={() => setWasInteractionByTouch(false)}
          onBlur={() => setWasInteractionByTouch(false)}
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
        />
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
