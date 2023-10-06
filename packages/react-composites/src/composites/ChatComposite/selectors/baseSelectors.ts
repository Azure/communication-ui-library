// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatAdapterState } from '../adapter/ChatAdapter';
import { FileUploadsUiState } from '../adapter/AzureCommunicationFileUploadAdapter';

/**
 * @private
 */
export const getUserId = (state: ChatAdapterState): CommunicationIdentifierKind => state.userId;

/**
 * @private
 */
export const getFileUploads = (state: ChatAdapterState): FileUploadsUiState | undefined => {
  /* @conditional-compile-remove(file-sharing) */
  return state?.fileUploads;
  return undefined;
};
