// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Icon } from '@fluentui/react';
/* @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadata } from '../../types/Attachment';
import { isMessageTooLong } from './SendBoxUtils';
/* @conditional-compile-remove(attachment-upload) */
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
  /* @conditional-compile-remove(attachment-upload) */
  attachmentMetadata?: AttachmentMetadata[]
): boolean {
  /* @conditional-compile-remove(attachment-upload) */
  return messageText.trim().length === 0 && attachmentMetadata?.length === 0;
  return messageText.trim().length === 0;
}

/**
 * @private
 */
export function getMessageState(
  messageText: string,
  /* @conditional-compile-remove(attachment-upload) */ attachmentMetadata: AttachmentMetadata[]
): MessageState {
  return isMessageEmpty(messageText, /* @conditional-compile-remove(attachment-upload) */ attachmentMetadata)
    ? 'too short'
    : isMessageTooLong(messageText.length)
    ? 'too long'
    : 'OK';
}

/* @conditional-compile-remove(attachment-upload) */
/**
 * @private
 * @TODO: Remove when file-sharing feature becomes stable.
 */
export function getMessageWithAttachmentMetadata(message: ChatMessage): AttachmentMetadata[] | undefined {
  return message.attachments;
}

/* @conditional-compile-remove(attachment-upload) */
/**
 * @private
 */
interface Action {
  type: string;
}

/* @conditional-compile-remove(attachment-upload) */
/**
 * @private
 */
type Actions = RemoveAction;

/* @conditional-compile-remove(attachment-upload) */
/**
 * @private
 */
interface RemoveAction extends Action {
  type: 'remove';
  id: string;
}

/* @conditional-compile-remove(attachment-upload) */
/**
 * @internal
 */
export const attachmentMetadataReducer = (state: AttachmentMetadata[], action: Actions): AttachmentMetadata[] => {
  switch (action.type) {
    case 'remove':
      return state.filter((v) => v.id !== action.id);
    default:
      return state;
  }
};
