// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  IStyle,
  mergeStyles,
  Link,
  ContextualMenu,
  DirectionalHint,
  IContextualMenuItem,
  Target,
  Theme
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
  const [hideContextMenu, setHideContextMenu] = useState<boolean>(true);

  // Control when the chat message action button is allowed to show. It should show when hovered over, or when the
  // chat message is navigated to via keyboard, but not on touch events.
  const [allowChatActionButtonShow, setAllowChatActionButtonShow] = useState(true);

  // The chat message action flyout should target the Chat.Message action menu if clicked,
  // or target the chat message if opened via long touch press.
  // False indicates the action menu should not be being shown.
  const [chatMessageActionFlyoutTarget, setChatMessageActionFlyoutTarget] = useState<
    React.MutableRefObject<HTMLElement | null> | undefined
  >(undefined);

  const chatActionsEnabled = !disableEditing && message.status !== 'sending' && !!message.mine;
  const actionMenuProps =
    !chatActionsEnabled || !allowChatActionButtonShow
      ? undefined
      : chatMessageActionMenuProps({
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

/**
 * Props for the Chat.Message action menu.
 * This is the 3 dots that appear when hovering over one of your own chat messages.
 */
const chatMessageActionMenuProps = (menuProps: {
  menuButtonRef: React.MutableRefObject<HTMLElement | null>;
  onActionButtonClick: () => void;
  theme: Theme;
}): MenuProps => {
  const menuClass = mergeStyles(chatActionsCSS, {
    'ul&': { boxShadow: menuProps.theme.effects.elevation4, backgroundColor: menuProps.theme.palette.white }
  });

  const actionMenuProps: MenuProps = {
    iconOnly: true,
    activeIndex: -1,
    className: menuClass,
    items: [
      {
        children: (
          <Ref innerRef={menuProps.menuButtonRef}>
            <MoreIcon
              className={iconWrapperStyle}
              onClick={() => menuProps.onActionButtonClick()}
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

interface ChatMessageActionFlyoutProps {
  target?: Target;
  hidden: boolean;
  strings: MessageThreadStrings;
  onEditClick: () => void;
  onRemoveClick: () => void;
  onDismiss: () => void;
}

/**
 * Chat message actions flyout that contains actions such as Edit Message, or Remove Message.
 */
const ChatMessageActionFlyout = (props: ChatMessageActionFlyoutProps): JSX.Element => {
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
    <ContextualMenu
      items={menuItems}
      hidden={props.hidden}
      target={props.target}
      onDismiss={props.onDismiss}
      directionalHint={DirectionalHint.topRightEdge}
      className={chatMessageMenuStyle}
    />
  );
};
