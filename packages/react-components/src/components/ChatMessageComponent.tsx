// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles, Theme } from '@fluentui/react';
import { Chat, Text, ComponentSlotStyle, MoreIcon, MenuProps, Ref } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import React, { useRef, useState } from 'react';
import { EditBox } from './EditBox';
import { MessageThreadStrings } from './MessageThread';
import {
  chatMessageDateStyle,
  chatActionsCSS,
  iconWrapperStyle,
  chatMessageEditedTagStyle
} from './styles/ChatMessageComponent.styles';
import { formatTimeForChatMessage, formatTimestampForChatMessage } from './utils/Datetime';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { useTheme } from '../theming';
import { ChatMessage } from '../types';
import { useLongPress, LongPressDetectEvents } from 'use-long-press';
import { ChatMessageActionFlyout } from './ChatMessageActionsFlyout';
import { GenerateMessageContent } from './utils/chatMessageContentGenerators';

type ChatMessageProps = {
  message: ChatMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onUpdateMessage?: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  strings: MessageThreadStrings;
};

/**
 * @private
 */
export const ChatMessageComponent = (props: ChatMessageProps): JSX.Element => {
  const ids = useIdentifiers();
  const theme = useTheme();

  const { message, onUpdateMessage, onDeleteMessage, disableEditing, showDate, messageContainerStyle, strings } = props;
  const messageRef = useRef<HTMLDivElement | null>(null);
  const messageActionButtonRef = useRef<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Control when the chat message action button is allowed to show. It should show when hovered over, or when the
  // chat message is navigated to via keyboard, but not on touch events.
  const [allowChatActionButtonShow, setAllowChatActionButtonShow] = useState(true);

  // The chat message action flyout should target the Chat.Message action menu if clicked,
  // or target the chat message if opened via long touch press.
  // Undefined indicates the action menu should not be being shown.
  const [chatMessageActionFlyoutTarget, setChatMessageActionFlyoutTarget] = useState<
    React.MutableRefObject<HTMLElement | null> | undefined
  >(undefined);

  const chatActionsEnabled = !disableEditing && message.status !== 'sending' && !!message.mine;
  const actionMenuProps = chatMessageActionMenuProps({
    enabled: chatActionsEnabled && allowChatActionButtonShow,
    // Force show the action button while the flyout is open and targeting the action menu button
    forceShow: chatMessageActionFlyoutTarget === messageActionButtonRef,
    menuButtonRef: messageActionButtonRef,
    onActionButtonClick: () => {
      // Open chat action flyout, and set the context menu to target the chat message action button
      setChatMessageActionFlyoutTarget(messageActionButtonRef);
    },
    theme
  });

  const longTouchPressProps = useLongPress(
    () => {
      // Open chat action flyout, and set the context menu to target the chat message
      setChatMessageActionFlyoutTarget(messageRef);
    },
    {
      // Don't show the action button when clicked via touch events
      onStart: () => setAllowChatActionButtonShow(false),
      // If the touch press didn't complete, allow the action menu to be shown on hover/focus again
      onCancel: () => setAllowChatActionButtonShow(true),
      captureEvent: true,
      cancelOnMovement: true,
      detect: LongPressDetectEvents.TOUCH
    }
  );

  if (message.messageType !== 'chat') {
    return <></>;
  }

  if (isEditing) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return (
      <EditBox
        initialValue={message.content ?? ''}
        strings={strings}
        onSubmit={async (text) => {
          onUpdateMessage && message.messageId && (await onUpdateMessage(message.messageId, text));
          setIsEditing(false);
        }}
        onCancel={() => {
          setIsEditing(false);
        }}
      />
    );
  }
  const messageContentItem = GenerateMessageContent(message, strings.liveAuthorIntro);

  const chatMessage = (
    <>
      <div ref={messageRef} {...longTouchPressProps}>
        <Chat.Message
          className={mergeStyles(messageContainerStyle as IStyle)}
          styles={messageContainerStyle}
          content={messageContentItem}
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
        />
      </div>

      {chatActionsEnabled && (
        <ChatMessageActionFlyout
          hidden={!chatMessageActionFlyoutTarget}
          target={chatMessageActionFlyoutTarget ?? undefined}
          onDismiss={() => {
            setChatMessageActionFlyoutTarget(undefined);
            setAllowChatActionButtonShow(true);
          }}
          onEditClick={() => {
            setIsEditing(true);
          }}
          onRemoveClick={async () => {
            onDeleteMessage && message.messageId && (await onDeleteMessage(message.messageId));
          }}
          strings={strings}
        />
      )}
    </>
  );

  return chatMessage;
};

type ChatMessageActionMenuProps = MenuProps & {
  showActionMenu?: boolean | undefined;
};

/**
 * Props for the Chat.Message action menu.
 * This is the 3 dots that appear when hovering over one of your own chat messages.
 */
const chatMessageActionMenuProps = (menuProps: {
  /** Whether the action menu button is enabled, if not this will always return undefined */
  enabled: boolean;
  /** Whether to force showing the action menu button - this has no effect if the action menu button is not enabled */
  forceShow: boolean;
  menuButtonRef: React.MutableRefObject<HTMLElement | null>;
  onActionButtonClick: () => void;
  theme: Theme;
}): ChatMessageActionMenuProps | undefined => {
  if (!menuProps.enabled) {
    return undefined;
  }

  const menuClass = mergeStyles(chatActionsCSS, {
    'ul&': { boxShadow: menuProps.theme.effects.elevation4, backgroundColor: menuProps.theme.palette.white }
  });

  const actionMenuProps: ChatMessageActionMenuProps = {
    showActionMenu: menuProps.forceShow === true ? true : undefined,
    iconOnly: true,
    activeIndex: -1,
    className: menuClass,
    onItemClick: () => menuProps.onActionButtonClick(),
    items: [
      {
        children: (
          <Ref innerRef={menuProps.menuButtonRef}>
            <MoreIcon
              className={iconWrapperStyle}
              {...{
                outline: true
              }}
            />
          </Ref>
        ),

        key: 'menuButton',
        indicator: false
      }
    ]
  };

  return actionMenuProps;
};
