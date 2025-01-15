// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { AttachmentMetadata, _formatString } from '@internal/acs-ui-common';
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
import { _AttachmentDownloadCardsStrings } from '../Attachment/AttachmentDownloadCards';
/* @conditional-compile-remove(data-loss-prevention) */
import { dataLossIconStyle } from '../styles/MessageThread.styles';
import { messageTextContentStyles } from '../styles/MessageThread.styles';

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
  className?: string;
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
    <div data-ui-status={props.message.status} role="text" aria-label={props.ariaLabel} className={props.className}>
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
      className={messageTextContentStyles}
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
  const Icon: JSX.Element = <FontIcon className={dataLossIconStyle} iconName={'DataLossPreventionProhibited'} />;
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
  if (props.message.content || props.message.attachments) {
    // Replace all <img> tags with 'image' for aria.
    const parsedContent = DOMPurify.sanitize(props.message.content ?? '', {
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

    // Inject message attachment count for aria.
    // this is only applying to file attachments not for inline images.
    if (props.message.attachments && props.message.attachments.length > 0) {
      const attachmentCardDescription = attachmentCardGroupDescription(props);
      const attachmentTextNode = document.createElement('div');
      attachmentTextNode.innerHTML = `${attachmentCardDescription}`;
      parsedContent.appendChild(attachmentTextNode);
    }

    // Strip all html tags from the content for aria.
    let message = DOMPurify.sanitize(parsedContent, { ALLOWED_TAGS: [] });
    // decode HTML entities so that screen reader can read the content properly.
    message = decodeEntities(message);
    return message;
  }
  return '';
};

const generateLiveMessage = (props: ChatMessageContentProps): string => {
  const messageContent = extractContentForAllyMessage(props);

  if (props.message.editedOn) {
    const liveAuthor = _formatString(props.strings.editedMessageLiveAuthorIntro, {
      author: `${props.message.senderDisplayName}`
    });
    return `${props.message.mine ? props.strings.editedMessageLocalUserLiveAuthorIntro : liveAuthor} ${messageContent}`;
  } else {
    const liveAuthor = _formatString(props.strings.liveAuthorIntro, {
      author: `${props.message.senderDisplayName}`
    });
    return `${props.message.mine ? '' : liveAuthor} ${messageContent} `;
  }
};

const messageContentAriaText = (props: ChatMessageContentProps): string | undefined => {
  const message = extractContentForAllyMessage(props);
  return props.message.mine
    ? _formatString(props.strings.messageContentMineAriaText, {
        status: props.message.status ?? '',
        message: message
      })
    : _formatString(props.strings.messageContentAriaText, {
        status: props.message.status ?? '',
        author: `${props.message.senderDisplayName}`,
        message: message
      });
};

const attachmentCardGroupDescription = (props: ChatMessageContentProps): string => {
  const attachments = props.message.attachments;
  return getAttachmentCountLiveMessage(attachments ?? [], props.strings.attachmentCardGroupMessage);
};

/**
 * @private
 */
export const getAttachmentCountLiveMessage = (
  attachments: AttachmentMetadata[],
  attachmentCardGroupMessage: string
): string => {
  if (attachments.length === 0) {
    return '';
  }
  return _formatString(attachmentCardGroupMessage, {
    attachmentCount: `${attachments.length}`
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
        if (domNode.name === 'msft-mention' && domNode.attribs.id) {
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
          if (domNode.attribs.name) {
            domNode.attribs['aria-label'] = domNode.attribs.name;
          }
          const imgProps = attributesToProps(domNode.attribs);
          const inlineImageProps: InlineImage = { messageId: props.message.messageId, imageAttributes: imgProps };

          return props.inlineImageOptions?.onRenderInlineImage
            ? props.inlineImageOptions.onRenderInlineImage(inlineImageProps, defaultOnRenderInlineImage)
            : defaultOnRenderInlineImage(inlineImageProps);
        }

        // Transform links to open in new tab
        if (domNode.name === 'a' && React.isValidElement<React.AnchorHTMLAttributes<HTMLAnchorElement>>(reactNode)) {
          return React.cloneElement(reactNode, {
            target: '_blank',
            rel: 'noreferrer noopener'
          });
        }
      }
      // Pass through the original node
      return reactNode as unknown as JSX.Element;
    }
  };
  return <>{parse(props.message.content ?? '', options)}</>;
};

const decodeEntities = (encodedString: string): string => {
  // This regular expression matches HTML entities.
  const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
  // This object maps HTML entities to their respective characters.
  const translate: Record<string, string> = {
    nbsp: ' ',
    amp: '&',
    quot: '"',
    lt: '<',
    gt: '>'
  };

  return (
    encodedString
      // Find all matches of HTML entities defined in translate_re and
      // replace them with the corresponding character from the translate object.
      .replace(translate_re, function (match, entity) {
        return translate[entity] ?? match;
      })
      // Find numeric entities (e.g., &#65;)
      // and replace them with the equivalent character using the String.fromCharCode method,
      // which converts Unicode values into characters.
      .replace(/&#(\d+);/gi, function (match, numStr) {
        const num = parseInt(numStr, 10);
        return String.fromCharCode(num);
      })
  );
};
