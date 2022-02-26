// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatAdapterState } from '../adapter/ChatAdapter';
/* @conditional-compile-remove(file-sharing) */
import { FileUploadsUiState } from '../adapter/AzureCommunicationFileUploadAdapter';

/**
 * @private
 */
export const getUserId = (state: ChatAdapterState): CommunicationIdentifierKind => state.userId;

/* @conditional-compile-remove(file-sharing) */
/**
 * @private
 */
export const getFileUploads = (state: ChatAdapterState): FileUploadsUiState | undefined => {
  return state?.fileUploads;
};
