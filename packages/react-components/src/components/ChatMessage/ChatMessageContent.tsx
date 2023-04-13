// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _formatString } from '@internal/acs-ui-common';
import { Parser, ProcessNodeDefinitions, IsValidNodeDefinitions, ProcessingInstructionType } from 'html-to-react';
import Linkify from 'react-linkify';
import { ChatMessage } from '../../types/ChatMessage';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../types/ChatMessage';
import { LiveMessage } from 'react-aria-live';
import { Link } from '@fluentui/react';
/* @conditional-compile-remove(at-mention) */
import { AtMentionDisplayOptions, AtMentionSuggestion } from '../AtMentionFlyout';

/* @conditional-compile-remove(data-loss-prevention) */
import { FontIcon, Stack } from '@fluentui/react';
import { MessageThreadStrings } from '../MessageThread';

type ChatMessageContentProps = {
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(at-mention) */
  atMentionDisplayOptions?: AtMentionDisplayOptions;
};

/* @conditional-compile-remove(data-loss-prevention) */
type BlockedMessageContentProps = {
  message: BlockedMessage;
  strings: MessageThreadStrings;
};

type MessageContentWithLiveAriaProps = {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
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
  const htmlToReactParser = Parser();
  const liveAuthor = _formatString(props.strings.liveAuthorIntro, { author: `${props.message.senderDisplayName}` });
  const atMentionSuggestionRenderer = props.atMentionDisplayOptions?.atMentionSuggestionRenderer;

  if (!!atMentionSuggestionRenderer) {
    // Use custom HTML processing if atMentionSuggestionRenderer is provided

    const processNodeDefinitions = ProcessNodeDefinitions();
    const processingInstructions: ProcessingInstructionType[] = [
      {
        shouldProcessNode: (node) => {
          // Override the handling of the <msft-at-mention> tag in the HTML
          return node.name === 'msft-at-mention';
        },
        processNode: (node) => {
          const { userId, suggestionType, displayName } = node.attribs;
          const suggestion: AtMentionSuggestion = {
            userId: userId,
            suggestionType: suggestionType,
            displayName: displayName
          };
          return atMentionSuggestionRenderer(suggestion);
        }
      },
      {
        // Process everything else in the default way
        shouldProcessNode: () => {
          return true;
        },
        processNode: processNodeDefinitions.processDefaultNode
      }
    ];

    const htmlContent = htmlToReactParser.parseWithInstructions(
      props.message.content ?? '',
      IsValidNodeDefinitions.alwaysValid,
      processingInstructions
    );
    return (
      <MessageContentWithLiveAria
        message={props.message}
        liveMessage={`${props.message.mine ? '' : liveAuthor} ${extractContent(props.message.content || '')}`}
        ariaLabel={messageContentAriaText(props)}
        content={htmlContent}
      />
    );
  } else {
    return (
      <MessageContentWithLiveAria
        message={props.message}
        liveMessage={`${props.message.mine ? '' : liveAuthor} ${extractContent(props.message.content || '')}`}
        ariaLabel={messageContentAriaText(props)}
        content={htmlToReactParser.parse(props.message.content ?? '')}
      />
    );
  }
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
    props.message.warningText === false
      ? ''
      : props.message.warningText === '' || props.message.warningText === undefined
      ? props.strings.blockedWarningText
      : props.message.warningText;
  const blockedMessageLink = props.message.link;
  const blockedMessageLinkText = blockedMessageLink
    ? props.message.linkText ?? props.strings.blockedWarningLinkText
    : '';

  const liveAuthor =
    props.message.mine || props.message.senderDisplayName === undefined ? '' : props.message.senderDisplayName;
  const liveBlockedWarningText = `${liveAuthor} ${blockedMessage} ${blockedMessageLinkText}`;
  return (
    <MessageContentWithLiveAria
      message={props.message}
      liveMessage={liveBlockedWarningText}
      ariaLabel={liveBlockedWarningText}
      content={
        <Stack horizontal wrap>
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
