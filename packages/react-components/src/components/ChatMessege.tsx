// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useState, useRef } from 'react';
import { IStyle, mergeStyles, Link, ContextualMenu, DirectionalHint } from '@fluentui/react';
import { Chat, Text, ComponentSlotStyle } from '@fluentui/react-northstar';
import { ChatMessage, ChatMessagePayload } from '../types';
import { LiveMessage } from 'react-aria-live';
import Linkify from 'react-linkify';
import { useLocale } from '../localization/LocalizationProvider';
import {
  chatMessageDateStyle,
  chatMessageStyle,
  chatActionStyle,
  chatMessageMenuStyle
} from './styles/ChatMessage.styles';
import { formatTimeForChatMessage, formatTimestampForChatMessage } from './utils/Datetime';
import { useIdentifiers } from '../identifiers/IdentifierProvider';
import { Parser } from 'html-to-react';
import { MoreHorizontal20Regular } from '@fluentui/react-icons';

type ChatMessageProps = {
  message: ChatMessage;
  messageContainerStyle?: ComponentSlotStyle;
  showDate?: boolean;
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

  if (props.message.type === 'chat') {
    const payload: ChatMessagePayload = props.message.payload;
    const messageContentItem = GenerateMessageContent(payload);
    return (
      <Chat.Message
        className={mergeStyles(chatMessageStyle as IStyle, props.messageContainerStyle as IStyle)}
        content={messageContentItem}
        author={<Text className={mergeStyles(chatMessageDateStyle as IStyle)}>{payload.senderDisplayName}</Text>}
        mine={payload.mine}
        timestamp={
          <Text data-ui-id={ids.messageTimestamp}>
            {payload.createdOn
              ? props.showDate
                ? formatTimestampForChatMessage(payload.createdOn, new Date(), strings)
                : formatTimeForChatMessage(payload.createdOn)
              : undefined}
          </Text>
        }
        details={props.message.payload.mine ? <MoreButton /> : <></>}
      />
    );
  }
  return <></>;
};

const menuItems = [
  {
    key: 'Edit',
    text: 'Edit',
    iconProps: { iconName: 'Edit' },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick: () => {}
  },
  {
    key: 'Remove',
    text: 'Remove',
    iconProps: { iconName: 'Delete' },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick: () => {}
  }
];

const MoreButton = (): JSX.Element => {
  const buttonRef = useRef(null);
  const [menuHidden, setMenuHidden] = useState(true);
  return (
    <>
      <div ref={buttonRef} onClick={() => setMenuHidden(false)}>
        <MoreHorizontal20Regular className={chatActionStyle} primaryFill="currentColor" />
      </div>
      <ContextualMenu
        items={menuItems}
        hidden={menuHidden}
        target={buttonRef}
        onItemClick={() => setMenuHidden(true)}
        onDismiss={() => setMenuHidden(true)}
        directionalHint={DirectionalHint.bottomLeftEdge}
        className={chatMessageMenuStyle}
      />
    </>
  );
};
