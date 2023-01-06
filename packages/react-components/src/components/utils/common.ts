// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _FileUploadCardsStrings } from '../FileUploadCards';
/* @conditional-compile-remove(file-sharing) */
import { useLocale } from '../../localization';
import { ParticipantState } from '../../types';

/**
 * Conditionally modify locale strings passed to the file card
 * @returns file upload card strings
 */
export const useLocaleFileCardStringsTrampoline = (): _FileUploadCardsStrings => {
  /* @conditional-compile-remove(file-sharing) */
  return useLocale().strings.sendBox;
  return {
    removeFile: '',
    uploadCompleted: '',
    uploading: ''
  };
};

/**
 * Identify if a participant state if part of the Calling states or Hold states.
 */
export const _isParticipantStateCallingOrHold = (participantState?: ParticipantState): boolean => {
  return !!participantState && ['Idle', 'Connecting', 'EarlyMedia', 'Ringing', 'Hold'].includes(participantState);
};
