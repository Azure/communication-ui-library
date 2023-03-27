// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(data-loss-prevention) */
import { IStyle, FontIcon, mergeStyles, Stack, Link } from '@fluentui/react';
/* @conditional-compile-remove(data-loss-prevention) */
import { ComponentSlotStyle } from '@fluentui/react-northstar';
/* @conditional-compile-remove(data-loss-prevention) */
import React from 'react';
/* @conditional-compile-remove(data-loss-prevention) */
import { LiveMessage } from 'react-aria-live';
/* @conditional-compile-remove(data-loss-prevention) */
import { OnRenderAvatarCallback } from '../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../types';
/* @conditional-compile-remove(data-loss-prevention) */
import { MessageThreadStrings } from './MessageThread';

/* @conditional-compile-remove(data-loss-prevention) */
/**
 * @private
 */
export type BlockedMessageProps = {
  /**
   * Content string for the system message.
   */
  message: BlockedMessage;
  messageContainerStyle?: ComponentSlotStyle;

  showDate?: boolean;
  messageStatus?: string;
  showMessageStatus?: boolean;

  /**
   * Content string for the system message.
   */
  strings: MessageThreadStrings;
  /*
   * Custom CSS Style for the system message container.
   */

  /**
   * Optional callback to override render of the avatar.
   *
   * @param userId - user Id
   */
  onRenderAvatar?: OnRenderAvatarCallback;
  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
};

/* @conditional-compile-remove(data-loss-prevention) */
/**
 * @private
 */
export const BlockedMessageContent = (props: BlockedMessageProps): JSX.Element => {
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

  const liveBlockedContentText = `${
    props.message.mine ? '' : props.message.senderDisplayName
  } ${blockedMessage} ${blockedMessageLinkText}`;
  return (
    <div data-ui-status={props.message.status} role="text" aria-label={liveBlockedContentText}>
      <LiveMessage message={liveBlockedContentText} aria-live="polite" />
      <Stack className={mergeStyles(props?.messageContainerStyle as IStyle)} horizontal wrap>
        {Icon}
        {blockedMessage && <p>{blockedMessage}</p>}
        {blockedMessageLink && (
          <Link target={'_blank'} href={blockedMessageLink}>
            {blockedMessageLinkText}
          </Link>
        )}
      </Stack>
    </div>
  );
};

export {};
