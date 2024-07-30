// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Icon } from '@fluentui/react';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { isMessageTooLong } from './SendBoxUtils';
/* @conditional-compile-remove(file-sharing-acs) */
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
  /* @conditional-compile-remove(file-sharing-acs) */
  attachmentMetadata?: AttachmentMetadata[]
): boolean {
  /* @conditional-compile-remove(file-sharing-acs) */
  return messageText.trim().length === 0 && attachmentMetadata?.length === 0;
  return messageText.trim().length === 0;
}

/**
 * @private
 */
export function getMessageState(
  messageText: string,
  /* @conditional-compile-remove(file-sharing-acs) */ attachments: AttachmentMetadata[]
): MessageState {
  return isMessageEmpty(messageText, /* @conditional-compile-remove(file-sharing-acs) */ attachments)
    ? 'too short'
    : isMessageTooLong(messageText.length)
      ? 'too long'
      : 'OK';
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 * @TODO: Remove when file-sharing feature becomes stable.
 */
export function getMessageWithAttachmentMetadata(message: ChatMessage): AttachmentMetadata[] | undefined {
  return message.attachments;
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
interface Action {
  type: string;
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * Currently `Actions` only have one action which is to remove.
 * But in the future, we may have more actions like `add`, `update`, etc.
 * And this action would be a uinon of all those actions.
 * i.e. `type Actions = RemoveAction | AddAction | UpdateAction;`
 * @private
 */
type Actions = RemoveAction;

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
interface RemoveAction extends Action {
  type: 'remove';
  id: string;
}

/* @conditional-compile-remove(file-sharing-acs) */
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

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @internal
 */
export const doesMessageContainMultipleAttachments = (message: ChatMessage): boolean => {
  const length = message.attachments?.length ?? 0;
  return length > 1;
};
