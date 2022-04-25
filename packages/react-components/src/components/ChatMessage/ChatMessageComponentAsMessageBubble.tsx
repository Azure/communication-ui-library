// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import { Chat, Text, ComponentSlotStyle } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import { MessageThreadStrings } from '../MessageThread';
import { chatMessageActionMenuProps } from './ChatMessageActionMenu';
import { OnRenderAvatarCallback } from '../../types';
import { _FileDownloadCards, FileDownloadHandler } from '../FileDownloadCards';

type ChatMessageComponentAsMessageBubbleProps = {
  message: ChatMessage;
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
};

/** @private */
const MessageBubble = (props: ChatMessageComponentAsMessageBubbleProps): JSX.Element => {
  const ids = useIdentifiers();
  const theme = useTheme();

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

  const chatActionsEnabled = !disableEditing && message.status !== 'sending' && !!message.mine;
  const [messageReadBy, setMessageReadBy] = useState<{ id: string; displayName: string }[]>([]);

  const actionMenuProps = wasInteractionByTouch
    ? undefined
    : chatMessageActionMenuProps({
        ariaLabel: strings.actionMenuMoreOptions,
        enabled: chatActionsEnabled,
        menuButtonRef: messageActionButtonRef,
        // Force show the action button while the flyout is open (otherwise this will dismiss when the pointer is hovered over the flyout)
        forceShow: chatMessageActionFlyoutTarget === messageActionButtonRef,
        onActionButtonClick: () => {
          props.onActionButtonClick(message, setMessageReadBy);
          setChatMessageActionFlyoutTarget(messageActionButtonRef);
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
      />
    ),
    [message, fileDownloadHandler, userId]
  );

  const messageAriaLabel = useMemo(
    () =>
      _formatString(strings.messageContentAriaLabel, {
        displayName: `${message.mine ? strings.localSenderAriaLabel : message.senderDisplayName}`,
        timeStamp: `${
          showDate
            ? formatTimestampForChatMessage(message.createdOn, new Date(), strings)
            : formatTimeForChatMessage(message.createdOn)
        }`,
        content: `${message.content?.toString()}`
      }),
    [message, showDate, strings]
  );

  const chatMessage = (
    <>
      <div ref={messageRef}>
        <Chat.Message
          aria-label={messageAriaLabel}
          data-ui-id="chat-composite-message"
          className={mergeStyles(messageContainerStyle as IStyle)}
          styles={messageContainerStyle}
          content={
            <div>
              <ChatMessageContent message={message} liveAuthorIntro={strings.liveAuthorIntro} />
              {props.onRenderFileDownloads
                ? props.onRenderFileDownloads(userId, message)
                : defaultOnRenderFileDownloads()}
            </div>
          }
          author={<Text className={chatMessageDateStyle}>{message.senderDisplayName}</Text>}
          mine={message.mine}
          timestamp={
            <Text data-ui-id={ids.messageTimestamp}>
              {message.createdOn
                ? showDate
                  ? formatTimestampForChatMessage(message.createdOn, new Date(), strings)
                  : formatTimeForChatMessage(message.createdOn)
                : undefined}
            </Text>
          }
          details={
            messageStatus === 'failed' ? (
              <div className={chatMessageFailedTagStyle(theme)}>{strings.failToSendTag}</div>
            ) : message.editedOn ? (
              <div className={chatMessageEditedTagStyle(theme)}>{strings.editedTag}</div>
            ) : undefined
          }
          positionActionMenu={false}
          actionMenu={actionMenuProps}
          onTouchStart={() => setWasInteractionByTouch(true)}
          onPointerDown={() => setWasInteractionByTouch(false)}
          onKeyDown={() => setWasInteractionByTouch(false)}
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
            props.onActionButtonClick(message, setMessageReadBy);
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
