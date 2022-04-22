// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _formatString } from '@internal/acs-ui-common';
import { Parser } from 'html-to-react';
import Linkify from 'react-linkify';
import { ChatMessage } from '../../types/ChatMessage';
import { LiveMessage } from 'react-aria-live';
import { IStyle, mergeStyles, Theme, useTheme } from '@fluentui/react';

type ChatMessageContentProps = {
  message: ChatMessage;
  liveAuthorIntro: string;
};

/** @private */
export const ChatMessageContent = (props: ChatMessageContentProps): JSX.Element => {
  switch (props.message.contentType) {
    case 'text':
      return MessageContentAsText(props.message, props.liveAuthorIntro);
    case 'html':
      return MessageContentAsRichTextHTML(props.message, props.liveAuthorIntro);
    case 'richtext/html':
      return MessageContentAsRichTextHTML(props.message, props.liveAuthorIntro);
    default:
      console.warn('unknown message content type');
      return <></>;
  }
};

const MessageContentAsRichTextHTML = (message: ChatMessage, liveAuthorIntro: string): JSX.Element => {
  const htmlToReactParser = new Parser();
  const liveAuthor = _formatString(liveAuthorIntro, { author: `${message.senderDisplayName}` });
  const theme = useTheme();
  return (
    <div data-ui-status={message.status} className={mergeStyles(linkStyles(theme))}>
      <LiveMessage
        message={`${message.mine ? '' : liveAuthor} ${extractContent(message.content || '')}`}
        aria-live="polite"
      />
      {htmlToReactParser.parse(message.content)}
    </div>
  );
};

const MessageContentAsText = (message: ChatMessage, liveAuthorIntro: string): JSX.Element => {
  const liveAuthor = _formatString(liveAuthorIntro, { author: `${message.senderDisplayName}` });
  const theme = useTheme();
  return (
    <div data-ui-status={message.status} className={mergeStyles(linkStyles(theme))}>
      <LiveMessage message={`${message.mine ? '' : liveAuthor} ${message.content}`} aria-live="polite" />
      <Linkify>{message.content}</Linkify>
    </div>
  );
};

// https://stackoverflow.com/questions/28899298/extract-the-text-out-of-html-string-using-javascript
const extractContent = (s: string): string => {
  const span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
};

const linkStyles = (theme: Theme): IStyle => {
  return {
    '& a:link': {
      color: theme.palette.themePrimary
    },
    '& a:visited': {
      color: theme.palette.themeDarker
    },
    '& a:hover': {
      color: theme.palette.themeDarker
    },
    '& a:selected': {
      color: theme.palette.themeDarker
    }
  };
};
