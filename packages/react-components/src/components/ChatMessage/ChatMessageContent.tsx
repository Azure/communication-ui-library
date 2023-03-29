// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _formatString } from '@internal/acs-ui-common';
import { Parser } from 'html-to-react';
import Linkify from 'react-linkify';
import { ChatMessage } from '../../types/ChatMessage';
import { LiveMessage } from 'react-aria-live';
import { Link } from '@fluentui/react';
/* @conditional-compile-remove(at-mention) */
import { AtMentionDisplayOptions } from '../AtMentionFlyout';

type ChatMessageContentProps = {
  message: ChatMessage;
  liveAuthorIntro: string;
  messageContentAriaText?: string;
  /* @conditional-compile-remove(at-mention) */
  atMentionDisplayOptions?: AtMentionDisplayOptions;
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

const MessageContentAsRichTextHTML = (props: ChatMessageContentProps): JSX.Element => {
  const htmlToReactParser = new Parser();
  const liveAuthor = _formatString(props.liveAuthorIntro, { author: `${props.message.senderDisplayName}` });
  return (
    <div data-ui-status={props.message.status} role="text" aria-label={props.messageContentAriaText}>
      <LiveMessage
        message={`${props.message.mine ? '' : liveAuthor} ${extractContent(props.message.content || '')}`}
        aria-live="polite"
      />
      {htmlToReactParser.parse(props.message.content)}
    </div>
  );
};

const MessageContentAsText = (props: ChatMessageContentProps): JSX.Element => {
  const liveAuthor = _formatString(props.liveAuthorIntro, { author: `${props.message.senderDisplayName}` });
  return (
    <div data-ui-status={props.message.status} role="text" aria-label={props.messageContentAriaText}>
      <LiveMessage message={`${props.message.mine ? '' : liveAuthor} ${props.message.content}`} aria-live="polite" />
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
    </div>
  );
};

// https://stackoverflow.com/questions/28899298/extract-the-text-out-of-html-string-using-javascript
const extractContent = (s: string): string => {
  const span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
};
