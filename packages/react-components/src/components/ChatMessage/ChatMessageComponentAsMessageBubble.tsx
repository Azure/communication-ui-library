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

type ChatMessageComponentAsMessageBubbleProps = {
  message: ChatMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onEditClick: () => void;
  onRemoveClick?: () => void;
  strings: MessageThreadStrings;
};

/** @private */
export const ChatMessageComponentAsMessageBubble = (props: ChatMessageComponentAsMessageBubbleProps): JSX.Element => {
  const ids = useIdentifiers();
  const theme = useTheme();

  const { message, onRemoveClick, disableEditing, showDate, messageContainerStyle, strings, onEditClick } = props;

  // Track if the action menu was opened by touch - if so we increase the touch targets for the items
  const wasInteractionByTouch = useRef(false);

  // Track a reference to the action button as this is what the flyout targets
  const messageActionButtonRef = useRef<HTMLElement | null>(null);

  const chatActionsEnabled = !disableEditing && message.status !== 'sending' && !!message.mine;
  const [showActionFlyout, setShowActionFlyout] = useState(false);

  const actionMenuProps = chatMessageActionMenuProps({
    enabled: chatActionsEnabled,
    menuButtonRef: messageActionButtonRef,
    // Force show the action button while the flyout is open (otherwise this will dismiss when the pointer is hovered over the flyout)
    forceShow: showActionFlyout,
    onActionButtonClick: () => {
      setShowActionFlyout(true);
    },
    theme
  });

  const onActionFlyoutDismiss = useCallback((): void => {
    // When the flyout dismiss is called, since we control if the action flyout is visible
    // or not we need to set the target to undefined here to actually hide the action flyout
    setShowActionFlyout(false);
  }, [setShowActionFlyout]);

  const chatMessage = (
    <>
      <Chat.Message
        className={mergeStyles(messageContainerStyle as IStyle)}
        styles={messageContainerStyle}
        content={<ChatMessageContent message={message} liveAuthorIntro={strings.liveAuthorIntro} />}
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
        onTouchStart={() => (wasInteractionByTouch.current = true)}
        onPointerDown={() => (wasInteractionByTouch.current = false)}
        onKeyDown={() => (wasInteractionByTouch.current = false)}
      />

      {chatActionsEnabled && (
        <ChatMessageActionFlyout
          hidden={!showActionFlyout}
          target={messageActionButtonRef}
          increaseFlyoutItemSize={wasInteractionByTouch.current}
          onDismiss={onActionFlyoutDismiss}
          onEditClick={onEditClick}
          onRemoveClick={onRemoveClick}
          strings={strings}
        />
      )}
    </>
  );

  return chatMessage;
};
