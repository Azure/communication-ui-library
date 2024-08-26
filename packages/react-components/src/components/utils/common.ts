// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _AttachmentUploadCardsStrings } from '../Attachment/AttachmentUploadCards';
/* @conditional-compile-remove(file-sharing-acs) */
import { useLocale } from '../../localization';
import { ParticipantConnectionStatus } from '../../types';

/**
 * Conditionally modify locale strings passed to the attachment card
 * @returns attachment card strings
 */
export const useLocaleAttachmentCardStringsTrampoline = (): _AttachmentUploadCardsStrings => {
  /* @conditional-compile-remove(file-sharing-acs) */
  return useLocale().strings.sendBox;
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
export const _isParticipantStateCallingOrHold = (participantState?: ParticipantConnectionStatus): boolean => {
  return !!participantState && ['Idle', 'Connecting', 'EarlyMedia', 'Ringing', 'Hold'].includes(participantState);
};
