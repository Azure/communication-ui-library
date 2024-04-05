// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _AttachmentUploadCardsStrings } from '../AttachmentUploadCards';
import { AttachmentCardStrings } from '../AttachmentCard';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { useLocale } from '../../localization';
import { ParticipantState } from '../../types';

/**
 * Conditionally modify locale strings passed to the attachment upload cards
 * @returns attachment upload card strings
 */
export const useLocaleAttachmentUploadCardStringsTrampoline = (): _AttachmentUploadCardsStrings => {
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  return useLocale().strings.sendBox;
  return {
    removeAttachment: '',
    uploadCompleted: '',
    uploading: ''
  };
};

/**
 * Conditionally modify locale strings passed to the attachment card
 * @returns attachment card strings
 */
export const useLocaleAttachmentCardStringsTrampoline = (): _AttachmentUploadCardsStrings & AttachmentCardStrings => {
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  return { ...useLocale().strings.sendBox, ...useLocale().strings.attachmentCard };
  return {
    removeAttachment: '',
    uploadCompleted: '',
    uploading: '',
    attachmentMoreMenu: ''
  };
};

/**
 * Identify if a participant state if part of the Calling states or Hold states.
 */
export const _isParticipantStateCallingOrHold = (participantState?: ParticipantState): boolean => {
  return !!participantState && ['Idle', 'Connecting', 'EarlyMedia', 'Ringing', 'Hold'].includes(participantState);
};
