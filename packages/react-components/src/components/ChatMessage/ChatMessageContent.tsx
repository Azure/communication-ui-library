// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { useEffect } from 'react';
import { _formatString } from '@internal/acs-ui-common';
import parse, { HTMLReactParserOptions, Element as DOMElement, attributesToProps } from 'html-react-parser';

import Linkify from 'react-linkify';
import { ChatMessage } from '../../types/ChatMessage';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../types/ChatMessage';
import { Link } from '@fluentui/react';
/* @conditional-compile-remove(mention) */
import { MentionDisplayOptions, Mention } from '../MentionPopover';

/* @conditional-compile-remove(data-loss-prevention) */
import { FontIcon, Stack } from '@fluentui/react';
import { MessageThreadStrings } from '../MessageThread';
import { AttachmentMetadata } from '../FileDownloadCards';
import LiveMessage from '../Announcer/LiveMessage';
/* @conditional-compile-remove(mention) */
import { defaultOnMentionRender } from './MentionRenderer';
import DOMPurify from 'dompurify';

type ChatMessageContentProps = {
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(mention) */
  mentionDisplayOptions?: MentionDisplayOptions;
  attachmentsMap?: Record<string, string>;
  onFetchAttachments?: (attachments: AttachmentMetadata[], messageId: string) => Promise<void>;
  onInlineImageClicked?: (attachmentId: string) => void;
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
      <LiveMessage message={props.liveMessage} ariaLive="polite" />
      {props.content}
    </div>
  );
};

const MessageContentAsRichTextHTML = (props: ChatMessageContentProps): JSX.Element => {
  const { message, attachmentsMap, onFetchAttachments } = props;
  useEffect(() => {
    if (!attachmentsMap || !onFetchAttachments) {
      return;
    }
    const attachments = message.inlineImages?.filter((inlinedImages) => {
      return attachmentsMap[inlinedImages.id] === undefined;
    });
    if (attachments && attachments.length > 0) {
      onFetchAttachments(attachments, message.messageId);
    }
  }, [message.inlineImages, message.messageId, onFetchAttachments, attachmentsMap]);

  return (
    <MessageContentWithLiveAria
      message={props.message}
      liveMessage={generateLiveMessage(props)}
      ariaLabel={messageContentAriaText(props)}
      content={processHtmlToReact(props)}
    />
  );
};

const MessageContentAsText = (props: ChatMessageContentProps): JSX.Element => {
  return (
    <MessageContentWithLiveAria
      message={props.message}
      liveMessage={generateLiveMessage(props)}
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
    props.message.warningText === undefined ? props.strings.blockedWarningText : props.message.warningText;
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

const generateLiveMessage = (props: ChatMessageContentProps): string => {
  const liveAuthor = _formatString(props.strings.liveAuthorIntro, { author: `${props.message.senderDisplayName}` });

  return `${props.message.editedOn ? props.strings.editedTag : ''} ${
    props.message.mine ? '' : liveAuthor
  } ${extractContent(props.message.content || '')} `;
};

const messageContentAriaText = (props: ChatMessageContentProps): string | undefined => {
  // Strip all html tags from the content for aria.

  return props.message.content
    ? props.message.mine
      ? _formatString(props.strings.messageContentMineAriaText, {
          message: DOMPurify.sanitize(props.message.content, { ALLOWED_TAGS: [] })
        })
      : _formatString(props.strings.messageContentAriaText, {
          author: `${props.message.senderDisplayName}`,
          message: DOMPurify.sanitize(props.message.content, { ALLOWED_TAGS: [] })
        })
    : undefined;
};

const processHtmlToReact = (props: ChatMessageContentProps): JSX.Element => {
  const options: HTMLReactParserOptions = {
    transform(reactNode, domNode) {
      if (domNode instanceof DOMElement && domNode.attribs) {
        // Transform custom rendering of mentions
        /* @conditional-compile-remove(mention) */
        if (props.mentionDisplayOptions?.onRenderMention && domNode.name === 'msft-mention') {
          const { id } = domNode.attribs;
          const mention: Mention = {
            id: id,
            displayText: (domNode.children[0] as unknown as Text).nodeValue ?? ''
          };
          return props.mentionDisplayOptions.onRenderMention(mention, defaultOnMentionRender);
        }

        // Transform inline images
        if (
          domNode.name &&
          domNode.name === 'img' &&
          domNode.attribs &&
          domNode.attribs.id &&
          props.message.inlineImages?.find((metadata) => {
            return metadata.id === domNode.attribs.id;
          })
        ) {
          domNode.attribs['aria-label'] = domNode.attribs.name;
          // logic to check id in map/list
          if (props.attachmentsMap && domNode.attribs.id in props.attachmentsMap) {
            domNode.attribs.src = props.attachmentsMap[domNode.attribs.id];
          }
          const handleOnClick = (): void => {
            props.onInlineImageClicked && props.onInlineImageClicked(domNode.attribs.id);
          };
          const imgProps = attributesToProps(domNode.attribs);
          return (
            <span
              data-ui-id={domNode.attribs.id}
              onClick={handleOnClick}
              tabIndex={0}
              role="button"
              style={{
                cursor: 'pointer'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleOnClick();
                }
              }}
            >
              <img {...imgProps} />
            </span>
          );
        }
      }
      return <>{reactNode}</>;
    }
  };
  return <>{parse(props.message.content ?? '', options)}</>;
};
