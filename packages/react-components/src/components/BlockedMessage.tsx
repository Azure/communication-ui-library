// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, FontIcon, mergeStyles, Stack, Link } from '@fluentui/react';
import { ComponentSlotStyle } from '@fluentui/react-northstar';
import React from 'react';
import { LiveMessage } from 'react-aria-live';
import { BlockedMessage, OnRenderAvatarCallback } from '../types';
import { MessageThreadStrings } from './MessageThread';

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

/**
 * @private
 */
export const BlockedMessageContent = (props: BlockedMessageProps): JSX.Element => {
  const Icon: JSX.Element =
    props.message.iconName === false ? (
      <></>
    ) : (
      <FontIcon iconName={props.message.iconName ?? 'DataLossPreventionProhibited'} />
    );
  const blockedMessage =
    props.message.content === false
      ? ''
      : props.message.content === '' || props.message.content === undefined
      ? props.strings.blockedContentText
      : props.message.content;
  const blockedMessageLinkText = props.message.linkText ?? props.strings.blockedContentLinkText;
  const blockedMessageLink = props.message.link ?? 'https://go.microsoft.com/fwlink/?LinkId=2132837';
  const liveBlockedContentText = `${
    props.message.mine ? '' : props.message.senderDisplayName
  } ${blockedMessage} ${blockedMessageLinkText}`;
  return (
    <div data-ui-status={props.message.status} role="text" aria-label={liveBlockedContentText}>
      <LiveMessage message={liveBlockedContentText} aria-live="polite" />
      <Stack className={mergeStyles(props?.messageContainerStyle as IStyle)} horizontal wrap>
        {Icon}
        {blockedMessage && <p>{blockedMessage}</p>}
        <Link target={'_blank'} href={blockedMessageLink}>
          {blockedMessageLinkText}
        </Link>
      </Stack>
    </div>
  );
};
