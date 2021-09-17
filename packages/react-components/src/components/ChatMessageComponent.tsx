// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useMemo, useRef, useState } from 'react';
import { IStyle, mergeStyles, Link, ContextualMenu, DirectionalHint, IContextualMenuItem } from '@fluentui/react';
import { Chat, Text, ComponentSlotStyle, MoreIcon, MenuProps } from '@fluentui/react-northstar';
import { ChatMessage, ChatMessagePayload } from '../types';
import { LiveMessage } from 'react-aria-live';
import Linkify from 'react-linkify';
import { useLocale } from '../localization/LocalizationProvider';
import {
  chatMessageMenuStyle,
  chatMessageDateStyle,
  chatActionsCSS,
  iconWrapperStyle,
  menuIconStyleSet
} from './styles/ChatMessageComponent.styles';
import { formatTimeForChatMessage, formatTimestampForChatMessage } from './utils/Datetime';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { Parser } from 'html-to-react';
import { useTheme } from '../theming';
import { EditBox } from './EditBox';

type ChatMessageProps = {
  message: ChatMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
  editDisabled?: boolean;
  onUpdateMessage?: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => Promise<void>;
};

// https://stackoverflow.com/questions/28899298/extract-the-text-out-of-html-string-using-javascript
const extractContent = (s: string): string => {
  const span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
};

const GenerateMessageContent = (payload: ChatMessagePayload): JSX.Element => {
  switch (payload.type) {
    case 'text':
      return GenerateTextMessageContent(payload);
    case 'html':
      return GenerateRichTextHTMLMessageContent(payload);
    case 'richtext/html':
      return GenerateRichTextHTMLMessageContent(payload);
    default:
      console.warn('unknown message content type');
      return <></>;
  }
};

const GenerateRichTextHTMLMessageContent = (payload: ChatMessagePayload): JSX.Element => {
  const htmlToReactParser = new Parser();
  const liveAuthor = `${payload.senderDisplayName} says `;
  return (
    <div data-ui-status={payload.status}>
      <LiveMessage
        message={`${payload.mine ? '' : liveAuthor} ${extractContent(payload.content || '')}`}
        aria-live="polite"
      />
      {htmlToReactParser.parse(payload.content)}
    </div>
  );
};

const GenerateTextMessageContent = (payload: ChatMessagePayload): JSX.Element => {
  const liveAuthor = `${payload.senderDisplayName} says `;
  return (
    <div data-ui-status={payload.status}>
      <LiveMessage message={`${payload.mine ? '' : liveAuthor} ${payload.content}`} aria-live="polite" />
      <Linkify
        componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => {
          return (
            <Link href={decoratedHref} key={key}>
              {decoratedText}
            </Link>
          );
        }}
      >
        {payload.content}
      </Linkify>
    </div>
  );
};

export const ChatMessageComponent = (props: ChatMessageProps): JSX.Element => {
  const strings = useLocale().strings.messageThread;
  const ids = useIdentifiers();
  const theme = useTheme();

  const { message, onUpdateMessage, onDeleteMessage, editDisabled, showDate, messageContainerStyle } = props;
  const [isEditing, setIsEditing] = useState(false);

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
              onEditClick={() => {
                setIsEditing(true);
              }}
              onRemoveClick={async () => {
                onDeleteMessage && message.payload.messageId && (await onDeleteMessage(message.payload.messageId));
              }}
            />
          ),

          key: 'menuButton2',
          'aria-label': 'More options',
          indicator: false
          // eslint-disable-next-line @typescript-eslint/no-empty-function
        }
      ]
    }),
    [menuClass, message.payload.messageId, onDeleteMessage]
  );

  if (message.type !== 'chat') {
    return <></>;
  }

  const payload: ChatMessagePayload = message.payload;

  if (isEditing) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return (
      <EditBox
        initialValue={payload.content ?? ''}
        onSubmit={async (text) => {
          onUpdateMessage && payload.messageId && (await onUpdateMessage(payload.messageId, text));
          setIsEditing(false);
        }}
        onCancel={() => {
          setIsEditing(false);
        }}
      />
    );
  }
  const messageContentItem = GenerateMessageContent(payload);
  return (
    <Chat.Message
      className={mergeStyles(messageContainerStyle as IStyle)}
      content={messageContentItem}
      author={<Text className={chatMessageDateStyle}>{payload.senderDisplayName}</Text>}
      mine={payload.mine}
      timestamp={
        <Text data-ui-id={ids.messageTimestamp}>
          {payload.createdOn
            ? showDate
              ? formatTimestampForChatMessage(payload.createdOn, new Date(), strings)
              : formatTimeForChatMessage(payload.createdOn)
            : undefined}
        </Text>
      }
      positionActionMenu={false}
      actionMenu={
        !editDisabled && message.payload.status !== 'sending' && message.payload.mine ? actionMenu : undefined
      }
    />
  );
};

const MoreMenu = ({
  onEditClick,
  onRemoveClick
}: {
  onEditClick: () => void;
  onRemoveClick: () => void;
}): JSX.Element => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuHidden, setMenuHidden] = useState(true);

  const menuItems = useMemo(
    (): IContextualMenuItem[] => [
      {
        key: 'Edit',
        text: 'Edit',
        iconProps: { iconName: 'MessageEdit', styles: menuIconStyleSet },
        onClick: onEditClick
      },
      {
        key: 'Remove',
        text: 'Remove',
        iconProps: {
          iconName: 'MessageRemove',
          styles: menuIconStyleSet
        },
        onClick: onRemoveClick
      }
    ],
    [onEditClick, onRemoveClick]
  );

  return (
    <div ref={menuRef}>
      <MoreIcon
        className={iconWrapperStyle}
        onClick={() => setMenuHidden(false)}
        {...{
          outline: true
        }}
      />
      <ContextualMenu
        items={menuItems}
        hidden={menuHidden}
        target={menuRef}
        onDismiss={() => setMenuHidden(true)}
        directionalHint={DirectionalHint.bottomLeftEdge}
        className={chatMessageMenuStyle}
      />
    </div>
  );
};
