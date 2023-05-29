// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(teams-inline-images) */
import { useEffect } from 'react';
import { _formatString } from '@internal/acs-ui-common';
import { Parser, ProcessNodeDefinitions, IsValidNodeDefinitions, ProcessingInstructionType } from 'html-to-react';

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
/* @conditional-compile-remove(teams-inline-images) */
import { FileMetadata } from '../FileDownloadCards';
import LiveMessage from '../Announcer/LiveMessage';
/* @conditional-compile-remove(mention) */
import { defaultOnMentionRender } from './MentionRenderer';

type ChatMessageContentProps = {
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(mention) */
  mentionDisplayOptions?: MentionDisplayOptions;
  /* @conditional-compile-remove(teams-inline-images) */
  attachmentsMap?: Record<string, string>;
  /* @conditional-compile-remove(teams-inline-images) */
  onFetchAttachment?: (attachment: FileMetadata) => Promise<void>;
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
  const liveAuthor = _formatString(props.strings.liveAuthorIntro, { author: `${props.message.senderDisplayName}` });

  /* @conditional-compile-remove(teams-inline-images) */
  useEffect(() => {
    props.message.attachedFilesMetadata?.map((fileMetadata) => {
      if (props.onFetchAttachment && props.attachmentsMap && props.attachmentsMap[fileMetadata.id] === undefined) {
        props.onFetchAttachment(fileMetadata);
      }
    });
  }, [props]);

  return (
    <MessageContentWithLiveAria
      message={props.message}
      liveMessage={`${props.message.mine ? '' : liveAuthor} ${extractContent(props.message.content || '')}`}
      ariaLabel={messageContentAriaText(props)}
      content={processHtmlToReact(props)}
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

const processNodeDefinitions = ProcessNodeDefinitions();
const htmlToReactParser = Parser();

/* @conditional-compile-remove(teams-inline-images) */
const processInlineImage = (props: ChatMessageContentProps): ProcessingInstructionType => ({
  // Custom <img> processing
  shouldProcessNode: (node): boolean => {
    // Process img node with id in attachments list
    return (
      node.name &&
      node.name === 'img' &&
      node.attribs &&
      node.attribs.id &&
      props.message.attachedFilesMetadata?.find((f) => f.id === node.attribs.id)
    );
  },
  processNode: (node, children, index): HTMLElement => {
    // logic to check id in map/list
    if (props.attachmentsMap && node.attribs.id in props.attachmentsMap) {
      node.attribs = { ...node.attribs, src: props.attachmentsMap[node.attribs.id] };
    }
    return processNodeDefinitions.processDefaultNode(node, children, index);
  }
});

/* @conditional-compile-remove(mention) */
const processMention = (props: ChatMessageContentProps): ProcessingInstructionType => ({
  shouldProcessNode: (node) => {
    if (props.mentionDisplayOptions?.onRenderMention) {
      // Override the handling of the <msft-mention> tag in the HTML if there's a custom renderer
      return node.name === 'msft-mention';
    }
    return false;
  },
  processNode: (node) => {
    if (props.mentionDisplayOptions?.onRenderMention) {
      const { id, displaytext } = node.attribs;
      const mention: Mention = {
        id: id,
        displayText: displaytext
      };
      return props.mentionDisplayOptions.onRenderMention(mention, defaultOnMentionRender);
    }
    return processNodeDefinitions.processDefaultNode;
  }
});

const processHtmlToReact = (props: ChatMessageContentProps): JSX.Element => {
  const steps: ProcessingInstructionType[] = [
    /* @conditional-compile-remove(teams-inline-images) */
    processInlineImage(props),
    /* @conditional-compile-remove(mention) */
    processMention(props),
    {
      // Process everything else in the default way
      shouldProcessNode: IsValidNodeDefinitions.alwaysValid,
      processNode: processNodeDefinitions.processDefaultNode
    }
  ];

  return htmlToReactParser.parseWithInstructions(
    props.message.content ?? '',
    IsValidNodeDefinitions.alwaysValid,
    steps
  );
};
