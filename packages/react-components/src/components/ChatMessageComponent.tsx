// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  IStyle,
  mergeStyles,
  Link,
  ContextualMenu,
  DirectionalHint,
  IContextualMenuItem,
  Target
} from '@fluentui/react';
import { Chat, Text, ComponentSlotStyle, MoreIcon, MenuProps, Ref } from '@fluentui/react-northstar';
import { _formatString } from '@internal/acs-ui-common';
import { Parser } from 'html-to-react';
import React, { useMemo, useRef, useState } from 'react';
import { LiveMessage } from 'react-aria-live';
import Linkify from 'react-linkify';
import { EditBox } from './EditBox';
import { MessageThreadStrings } from './MessageThread';
import {
  chatMessageMenuStyle,
  chatMessageDateStyle,
  chatActionsCSS,
  iconWrapperStyle,
  menuIconStyleSet,
  chatMessageEditedTagStyle
} from './styles/ChatMessageComponent.styles';
import { formatTimeForChatMessage, formatTimestampForChatMessage } from './utils/Datetime';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { useTheme } from '../theming';
import { ChatMessage } from '../types';
import { useLongPress, LongPressDetectEvents } from 'use-long-press';

type ChatMessageProps = {
  message: ChatMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  disableEditing?: boolean;
  onUpdateMessage?: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
  strings: MessageThreadStrings;
};

// https://stackoverflow.com/questions/28899298/extract-the-text-out-of-html-string-using-javascript
const extractContent = (s: string): string => {
  const span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
};

const GenerateMessageContent = (message: ChatMessage, liveAuthorIntro: string): JSX.Element => {
  switch (message.contentType) {
    case 'text':
      return GenerateTextMessageContent(message, liveAuthorIntro);
    case 'html':
      return GenerateRichTextHTMLMessageContent(message, liveAuthorIntro);
    case 'richtext/html':
      return GenerateRichTextHTMLMessageContent(message, liveAuthorIntro);
    default:
      console.warn('unknown message content type');
      return <></>;
  }
};

const GenerateRichTextHTMLMessageContent = (message: ChatMessage, liveAuthorIntro: string): JSX.Element => {
  const htmlToReactParser = new Parser();
  const liveAuthor = _formatString(liveAuthorIntro, { author: `${message.senderDisplayName}` });
  return (
    <div data-ui-status={message.status}>
      <LiveMessage
        message={`${message.mine ? '' : liveAuthor} ${extractContent(message.content || '')}`}
        aria-live="polite"
      />
      {htmlToReactParser.parse(message.content)}
    </div>
  );
};

const GenerateTextMessageContent = (message: ChatMessage, liveAuthorIntro: string): JSX.Element => {
  const liveAuthor = _formatString(liveAuthorIntro, { author: `${message.senderDisplayName}` });
  return (
    <div data-ui-status={message.status}>
      <LiveMessage message={`${message.mine ? '' : liveAuthor} ${message.content}`} aria-live="polite" />
      <Linkify
        componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => {
          return (
            <Link href={decoratedHref} key={key}>
              {decoratedText}
            </Link>
          );
        }}
      >
        {message.content}
      </Linkify>
    </div>
  );
};

enum ActionMenuState {
  Closed,
  OpenByClick,
  OpenByLongTouchPress
}

/**
 * @private
 */
export const ChatMessageComponent = (props: ChatMessageProps): JSX.Element => {
  const ids = useIdentifiers();
  const theme = useTheme();

  const { message, onUpdateMessage, onDeleteMessage, disableEditing, showDate, messageContainerStyle, strings } = props;
  const messageRef = useRef<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const actionMenuEnabled = !disableEditing && message.status !== 'sending' && !!message.mine;
  const [actionMenuOpen, setActionMenuOpen] = useState(ActionMenuState.Closed);
  const [isTouchStartActive, setIsTouchStartActive] = useState(false);

  const longPressProps = useLongPress(() => setActionMenuOpen(ActionMenuState.OpenByLongTouchPress), {
    onStart: () => setIsTouchStartActive(true),
    onFinish: () => setIsTouchStartActive(false),
    onCancel: () => setIsTouchStartActive(false),
    captureEvent: true,
    cancelOnMovement: true,
    detect: LongPressDetectEvents.TOUCH
  });

  const menuClass = mergeStyles(chatActionsCSS, {
    'ul&': { boxShadow: theme.effects.elevation4, backgroundColor: theme.palette.white }
  });

  const actionMenu: MenuProps = useMemo(
    (): MenuProps => ({
      iconOnly: true,
      activeIndex: -1,
      className: menuClass,
      items: [
        {
          children: (
            <MoreMenu
              showActionButton={!isTouchStartActive && actionMenuOpen !== ActionMenuState.OpenByLongTouchPress}
              showActionMenu={actionMenuOpen !== ActionMenuState.Closed}
              onActionButtonClick={() => setActionMenuOpen(ActionMenuState.OpenByClick)}
              onActionMenuDismiss={() => setActionMenuOpen(ActionMenuState.Closed)}
              contextMenuTarget={actionMenuOpen === ActionMenuState.OpenByLongTouchPress ? messageRef : undefined}
              onEditClick={() => {
                setIsEditing(true);
              }}
              onRemoveClick={async () => {
                onDeleteMessage && message.messageId && (await onDeleteMessage(message.messageId));
              }}
              strings={strings}
            />
          ),

          key: 'menuButton',
          indicator: false
        }
      ]
    }),
    [actionMenuOpen, isTouchStartActive, menuClass, message.messageId, onDeleteMessage, strings]
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
    <div ref={messageRef} {...longPressProps}>
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
        actionMenu={actionMenuEnabled ? actionMenu : undefined}
      />
    </div>
  );

  return chatMessage;
};

const MoreMenu = (props: {
  onActionButtonClick: () => void;
  onActionMenuDismiss: () => void;
  onEditClick: () => void;
  onRemoveClick: () => void;
  strings: MessageThreadStrings;
  showActionButton: boolean;
  showActionMenu: boolean;
  contextMenuTarget?: Target;
}): JSX.Element => {
  const menuButtonRef = useRef<HTMLElement | null>(null);

  const menuItems = useMemo(
    (): IContextualMenuItem[] => [
      {
        key: 'Edit',
        text: props.strings.editMessage,
        iconProps: { iconName: 'MessageEdit', styles: menuIconStyleSet },
        onClick: props.onEditClick
      },
      {
        key: 'Remove',
        text: props.strings.removeMessage,
        iconProps: {
          iconName: 'MessageRemove',
          styles: menuIconStyleSet
        },
        onClick: props.onRemoveClick
      }
    ],
    [props.onEditClick, props.onRemoveClick, props.strings.editMessage, props.strings.removeMessage]
  );

  return (
    <div>
      {props.showActionButton && (
        <Ref innerRef={menuButtonRef}>
          <MoreIcon
            className={iconWrapperStyle}
            onClick={props.onActionButtonClick}
            {...{
              outline: true
            }}
          />
        </Ref>
      )}
      {
        <ContextualMenu
          items={menuItems}
          hidden={!props.showActionMenu}
          target={props.contextMenuTarget ?? menuButtonRef}
          onDismiss={props.onActionMenuDismiss}
          directionalHint={DirectionalHint.topRightEdge}
          className={chatMessageMenuStyle}
        />
      }
    </div>
  );
};
