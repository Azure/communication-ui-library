// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Icon } from '@fluentui/react';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { AttachmentMetata } from '../../types/Attachment';
import { isMessageTooLong } from './SendBoxUtils';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { ChatMessage } from '../../types';

/**
 * @private
 */
export const onRenderCancelIcon = (className: string): JSX.Element => {
  return <Icon iconName={'EditBoxCancel'} className={className} />;
};

/**
 * @private
 */
export const onRenderSubmitIcon = (className: string): JSX.Element => {
  return <Icon iconName={'EditBoxSubmit'} className={className} />;
};

type MessageState = 'OK' | 'too short' | 'too long';

function isMessageEmpty(
  messageText: string,
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  attachmentMetadata?: AttachmentMetata[]
): boolean {
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  return messageText.trim().length === 0 && attachmentMetadata?.length === 0;
  return messageText.trim().length === 0;
}

/**
 * @private
 */
export function getMessageState(
  messageText: string,
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ attachmentMetadata: AttachmentMetata[]
): MessageState {
  return isMessageEmpty(
    messageText,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ attachmentMetadata
  )
    ? 'too short'
    : isMessageTooLong(messageText.length)
    ? 'too long'
    : 'OK';
}

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
/**
 * @private
 * @TODO: Remove when file-sharing feature becomes stable.
 */
export function getMessageAttachedFilesMetadata(message: ChatMessage): AttachmentMetata[] | undefined {
  return message.files;
}
