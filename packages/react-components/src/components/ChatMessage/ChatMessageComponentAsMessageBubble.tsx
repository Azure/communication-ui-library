// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import { Chat, Text, ComponentSlotStyle } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useRef, useState } from 'react';
import { chatMessageEditedTagStyle, chatMessageDateStyle } from '../styles/ChatMessageComponent.styles';
import { formatTimeForChatMessage, formatTimestampForChatMessage } from '../utils/Datetime';
import { useIdentifiers } from '../../identifiers/IdentifierProvider';
import { useTheme } from '../../theming';
import { ChatMessageActionFlyout } from './ChatMessageActionsFlyout';
import { ChatMessageContent } from './ChatMessageContent';
import { ChatMessage } from '../../types/ChatMessage';
import { MessageThreadStrings } from '../MessageThread';
import { chatMessageActionMenuProps } from './ChatMessageActionMenu';
import { OnRenderAvatarCallback } from '../../types';

type ChatMessageComponentAsMessageBubbleProps = {
  message: ChatMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onEditClick: () => void;
  onRemoveClick?: () => void;
  strings: MessageThreadStrings;
  userId: string;
  showMessageStatus?: boolean;
  /**
   * Optional callback to render uploaded files in the message component.
   */
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element;
  remoteParticipantsCount?: number;
  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
};

/** @private */
export const ChatMessageComponentAsMessageBubble = (props: ChatMessageComponentAsMessageBubbleProps): JSX.Element => {
  const ids = useIdentifiers();
  const theme = useTheme();

  const {
    message,
    onRemoveClick,
    disableEditing,
    showDate,
    messageContainerStyle,
    strings,
    onEditClick,
    remoteParticipantsCount = 0,
    onRenderAvatar,
    showMessageStatus
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

  const actionMenuProps = wasInteractionByTouch
    ? undefined
    : chatMessageActionMenuProps({
        enabled: chatActionsEnabled,
        menuButtonRef: messageActionButtonRef,
        // Force show the action button while the flyout is open (otherwise this will dismiss when the pointer is hovered over the flyout)
        forceShow: chatMessageActionFlyoutTarget === messageActionButtonRef,
        onActionButtonClick: () => {
          // Open chat action flyout, and set the context menu to target the chat message action button
          setChatMessageActionFlyoutTarget(messageActionButtonRef);
        },
        theme
      });

  const onActionFlyoutDismiss = useCallback((): void => {
    // When the flyout dismiss is called, since we control if the action flyout is visible
    // or not we need to set the target to undefined here to actually hide the action flyout
    setChatMessageActionFlyoutTarget(undefined);
  }, [setChatMessageActionFlyoutTarget]);

  const chatMessage = (
    <>
      <div ref={messageRef}>
        <Chat.Message
          className={mergeStyles(messageContainerStyle as IStyle)}
          styles={messageContainerStyle}
          content={
            <ChatMessageContent
              message={message}
              liveAuthorIntro={strings.liveAuthorIntro}
              onRenderFileDownloads={props.onRenderFileDownloads}
              userId={props.userId}
            />
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
            message.editedOn ? <div className={chatMessageEditedTagStyle(theme)}>{strings.editedTag}</div> : undefined
          }
          positionActionMenu={false}
          actionMenu={actionMenuProps}
          onTouchStart={() => setWasInteractionByTouch(true)}
          onPointerDown={() => setWasInteractionByTouch(false)}
          onKeyDown={() => setWasInteractionByTouch(false)}
          onClick={() => wasInteractionByTouch && setChatMessageActionFlyoutTarget(messageRef)}
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
          strings={strings}
          messageReadBy={message.readBy ?? []}
          remoteParticipantsCount={remoteParticipantsCount}
          onRenderAvatar={onRenderAvatar}
          showMessageStatus={showMessageStatus}
        />
      )}
    </>
  );

  return chatMessage;
};
