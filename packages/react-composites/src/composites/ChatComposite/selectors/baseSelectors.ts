// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatAdapterState } from '../adapter/ChatAdapter';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { FileUploadsUiState } from '../adapter/AzureCommunicationFileUploadAdapter';

/**
 * @private
 */
export const getUserId = (state: ChatAdapterState): CommunicationIdentifierKind => state.userId;

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const getFileUploads = (state: ChatAdapterState): FileUploadsUiState | undefined => {
  return state?.fileUploads;
};
