// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _formatString } from '@internal/acs-ui-common';
import { Parser } from 'html-to-react';
import Linkify from 'react-linkify';
import { ChatMessage } from '../../types/ChatMessage';
/* @conditional-compoile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../types/ChatMessage';
import { LiveMessage } from 'react-aria-live';
import { Link, Theme } from '@fluentui/react';
/* @conditional-compile-remove(data-loss-prevention) */
import { IStyle, FontIcon, mergeStyles, Stack } from '@fluentui/react';
import { MessageThreadStrings } from '../MessageThread';
/* @conditional-compile-remove(data-loss-prevention) */
import { ComponentSlotStyle } from '@fluentui/react-northstar';

type ChatMessageContentProps = {
  message: ChatMessage;
  theme: Theme;
  strings: MessageThreadStrings;
};

/* @conditional-compoile-remove(data-loss-prevention) */
type BlockedMessageContentProps = {
  message: BlockedMessage;
  theme: Theme;
  strings: MessageThreadStrings;
  messageContainerStyle?: ComponentSlotStyle;
};

type MessageContentWithLiveAriaProps = {
  message: ChatMessage | /* @conditional-compoile-remove(data-loss-prevention) */ BlockedMessage;
  liveMessage: string;
  ariaLabel?: string;
  content: JSX.Element;
};

/** @private */
export const ChatMessageContent = (props: ChatMessageContentProps): JSX.Element => {
  switch (props.message.contentType) {
    case 'text':
      return MessageContentAsText(props);
    case 'html':
      return MessageContentAsRichTextHTML(props);
    case 'richtext/html':
      return MessageContentAsRichTextHTML(props);
    default:
      console.warn('unknown message content type');
      return <></>;
  }
};

const MessageContentWithLiveAria = (props: MessageContentWithLiveAriaProps): JSX.Element => {
  return (
    <div data-ui-status={props.message.status} role="text" aria-label={props.ariaLabel}>
      <LiveMessage message={props.liveMessage} aria-live="polite" />
      {props.content}
    </div>
  );
};

const MessageContentAsRichTextHTML = (props: ChatMessageContentProps): JSX.Element => {
  const htmlToReactParser = new Parser();
  const liveAuthor = _formatString(props.strings.liveAuthorIntro, { author: `${props.message.senderDisplayName}` });
  return (
    <MessageContentWithLiveAria
      message={props.message}
      liveMessage={`${props.message.mine ? '' : liveAuthor} ${extractContent(props.message.content || '')}`}
      ariaLabel={messageContentAriaText(props)}
      content={htmlToReactParser.parse(props.message.content)}
    />
  );
};

const MessageContentAsText = (props: ChatMessageContentProps): JSX.Element => {
  const liveAuthor = _formatString(props.strings.liveAuthorIntro, { author: `${props.message.senderDisplayName}` });
  return (
    <MessageContentWithLiveAria
      message={props.message}
      liveMessage={`${props.message.mine ? '' : liveAuthor} ${extractContent(props.message.content || '')}`}
      ariaLabel={messageContentAriaText(props)}
      content={
        <Linkify
          componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => {
            return (
              <Link target="_blank" href={decoratedHref} key={key}>
                {decoratedText}
              </Link>
            );
          }}
        >
          {props.message.content}
        </Linkify>
      }
    />
  );
};

/* @conditional-compile-remove(data-loss-prevention) */
/**
 * @private
 */
export const BlockedMessageContent = (props: BlockedMessageContentProps): JSX.Element => {
  const Icon: JSX.Element = <FontIcon iconName={'DataLossPreventionProhibited'} />;
  const blockedMessage =
    props.message.content === false
      ? ''
      : props.message.content === '' || props.message.content === undefined
      ? props.strings.blockedContentText
      : props.message.content;
  const blockedMessageLink = props.message.link;
  const blockedMessageLinkText = blockedMessageLink
    ? props.message.linkText ?? props.strings.blockedContentLinkText
    : '';

  const liveAuthor =
    props.message.mine || props.message.senderDisplayName === undefined ? '' : props.message.senderDisplayName;
  const liveBlockedContentText = `${liveAuthor} ${blockedMessage} ${blockedMessageLinkText}`;
  return (
    <MessageContentWithLiveAria
      message={props.message}
      liveMessage={liveBlockedContentText}
      ariaLabel={liveBlockedContentText}
      content={
        <Stack className={mergeStyles(props?.messageContainerStyle as IStyle)} horizontal wrap>
          {Icon}
          {blockedMessage && <p>{blockedMessage}</p>}
          {blockedMessageLink && (
            <Link target={'_blank'} href={blockedMessageLink}>
              {blockedMessageLinkText}
            </Link>
          )}
        </Stack>
      }
    />
  );
};

// https://stackoverflow.com/questions/28899298/extract-the-text-out-of-html-string-using-javascript
const extractContent = (s: string): string => {
  const span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
};

const messageContentAriaText = (props: ChatMessageContentProps): string | undefined => {
  return props.message.content
    ? props.message.mine
      ? _formatString(props.strings.messageContentMineAriaText, {
          message: props.message.content
        })
      : _formatString(props.strings.messageContentAriaText, {
          author: `${props.message.senderDisplayName}`,
          message: props.message.content
        })
    : undefined;
};
