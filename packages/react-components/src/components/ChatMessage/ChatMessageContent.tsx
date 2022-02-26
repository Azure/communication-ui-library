// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _formatString } from '@internal/acs-ui-common';
import { Parser } from 'html-to-react';
import Linkify from 'react-linkify';
import { ChatMessage } from '../../types/ChatMessage';
import { LiveMessage } from 'react-aria-live';
import { Link } from '@fluentui/react';

type ChatMessageContentProps = {
  message: ChatMessage;
  liveAuthorIntro: string;
  userId: string;
  /**
   * Optional callback to render uploaded files in the message component.
   * @beta
   */
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element;
};

/** @private */
export const ChatMessageContent = (props: ChatMessageContentProps): JSX.Element => {
  switch (props.message.contentType) {
    case 'text':
      return MessageContentAsText(props.message, props.liveAuthorIntro, props.userId, props.onRenderFileDownloads);
    case 'html':
      return MessageContentAsRichTextHTML(
        props.message,
        props.liveAuthorIntro,
        props.userId,
        props.onRenderFileDownloads
      );
    case 'richtext/html':
      return MessageContentAsRichTextHTML(
        props.message,
        props.liveAuthorIntro,
        props.userId,
        props.onRenderFileDownloads
      );
    default:
      console.warn('unknown message content type');
      return <></>;
  }
};

const MessageContentAsRichTextHTML = (
  message: ChatMessage,
  liveAuthorIntro: string,
  userId: string,
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element
): JSX.Element => {
  const htmlToReactParser = new Parser();
  const liveAuthor = _formatString(liveAuthorIntro, { author: `${message.senderDisplayName}` });
  return (
    <div data-ui-status={message.status}>
      <LiveMessage
        message={`${message.mine ? '' : liveAuthor} ${extractContent(message.content || '')}`}
        aria-live="polite"
      />
      {htmlToReactParser.parse(message.content)}
      {
        /* @conditional-compile-remove(file-sharing) */
        onRenderFileDownloads && onRenderFileDownloads(userId, message)
      }
    </div>
  );
};

const MessageContentAsText = (
  message: ChatMessage,
  liveAuthorIntro: string,
  userId: string,
  onRenderFileDownloads?: (userId: string, message: ChatMessage) => JSX.Element
): JSX.Element => {
  const liveAuthor = _formatString(liveAuthorIntro, { author: `${message.senderDisplayName}` });
  return (
    <div data-ui-status={message.status}>
      <LiveMessage message={`${message.mine ? '' : liveAuthor} ${message.content}`} aria-live="polite" />
      <Linkify
        componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => {
          return (
            <Link target="_blank" href={decoratedHref} key={key}>
              {decoratedText}
            </Link>
          );
        }}
      >
        {message.content}
        {
          /* @conditional-compile-remove(file-sharing) */
          onRenderFileDownloads && onRenderFileDownloads(userId, message)
        }
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
