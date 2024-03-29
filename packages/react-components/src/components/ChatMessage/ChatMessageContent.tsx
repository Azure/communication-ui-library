// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _formatString } from '@internal/acs-ui-common';
import parse, { HTMLReactParserOptions, Element as DOMElement } from 'html-react-parser';
import { attributesToProps } from 'html-react-parser';
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
import LiveMessage from '../Announcer/LiveMessage';
/* @conditional-compile-remove(mention) */
import { defaultOnMentionRender } from './MentionRenderer';
import DOMPurify from 'dompurify';

type ChatMessageContentProps = {
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(mention) */
  mentionDisplayOptions?: MentionDisplayOptions;
  inlineImageOptions?: InlineImageOptions;
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

/**
 * InlineImage's state, as reflected in the UI.
 *
 * @public
 */
export interface InlineImage {
  /** ID of the message that the inline image is belonged to */
  messageId: string;
  /** Attributes of the inline image */
  imageAttributes: React.ImgHTMLAttributes<HTMLImageElement>;
}

/**
 * Options to display inline image in the inline image scenario.
 *
 * @public
 */
export interface InlineImageOptions {
  /**
   * Optional callback to render an inline image of in a message.
   */
  onRenderInlineImage?: (
    inlineImage: InlineImage,
    defaultOnRender: (inlineImage: InlineImage) => JSX.Element
  ) => JSX.Element;
}

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

const extractContentForAllyMessage = (props: ChatMessageContentProps): string => {
  if (props.message.content) {
    // Replace all <img> tags with 'image' for aria.
    const parsedContent = DOMPurify.sanitize(props.message.content, {
      ALLOWED_TAGS: ['img'],
      RETURN_DOM_FRAGMENT: true
    });

    parsedContent.childNodes.forEach((child) => {
      if (child.nodeName.toLowerCase() !== 'img') {
        return;
      }
      const imageTextNode = document.createElement('div');
      imageTextNode.innerHTML = 'image ';
      parsedContent.replaceChild(imageTextNode, child);
    });

    // Strip all html tags from the content for aria.
    const message = DOMPurify.sanitize(parsedContent, { ALLOWED_TAGS: [] });
    return message;
  }
  return '';
};

const generateLiveMessage = (props: ChatMessageContentProps): string => {
  const liveAuthor = _formatString(props.strings.liveAuthorIntro, { author: `${props.message.senderDisplayName}` });

  return `${props.message.editedOn ? props.strings.editedTag : ''} ${
    props.message.mine ? '' : liveAuthor
  } ${extractContentForAllyMessage(props)} `;
};

const messageContentAriaText = (props: ChatMessageContentProps): string | undefined => {
  const message = extractContentForAllyMessage(props);
  return props.message.mine
    ? _formatString(props.strings.messageContentMineAriaText, {
        message: message
      })
    : _formatString(props.strings.messageContentAriaText, {
        author: `${props.message.senderDisplayName}`,
        message: message
      });
};

const defaultOnRenderInlineImage = (inlineImage: InlineImage): JSX.Element => {
  return (
    <img
      key={inlineImage.imageAttributes.id}
      tabIndex={0}
      data-ui-id={inlineImage.imageAttributes.id}
      {...inlineImage.imageAttributes}
    />
  );
};

const processHtmlToReact = (props: ChatMessageContentProps): JSX.Element => {
  const options: HTMLReactParserOptions = {
    transform(reactNode, domNode) {
      if (domNode instanceof DOMElement && domNode.attribs) {
        // Transform custom rendering of mentions
        /* @conditional-compile-remove(mention) */
        if (domNode.name === 'msft-mention') {
          const { id } = domNode.attribs;
          const mention: Mention = {
            id: id,
            displayText: (domNode.children[0] as unknown as Text).nodeValue ?? ''
          };
          if (props.mentionDisplayOptions?.onRenderMention) {
            return props.mentionDisplayOptions.onRenderMention(mention, defaultOnMentionRender);
          }
          return defaultOnMentionRender(mention);
        }

        // Transform inline images
        if (domNode.name && domNode.name === 'img' && domNode.attribs && domNode.attribs.id) {
          domNode.attribs['aria-label'] = domNode.attribs.name;
          const imgProps = attributesToProps(domNode.attribs);
          const inlineImageProps: InlineImage = { messageId: props.message.messageId, imageAttributes: imgProps };

          return props.inlineImageOptions?.onRenderInlineImage
            ? props.inlineImageOptions.onRenderInlineImage(inlineImageProps, defaultOnRenderInlineImage)
            : defaultOnRenderInlineImage(inlineImageProps);

          return <img key={imgProps.id as string} {...imgProps} />;
        }
      }
      // Pass through the original node
      return reactNode as unknown as JSX.Element;
    }
  };
  return <>{parse(props.message.content ?? '', options)}</>;
};
