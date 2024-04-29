// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatAdapterState } from '../adapter/ChatAdapter';
// import { _AttachmentUploadsUiState } from '../adapter/AzureCommunicationAttachmentUploadAdapter';

/**
 * @private
 */
export const getUserId = (state: ChatAdapterState): CommunicationIdentifierKind => state.userId;

// /**
//  * @private
//  */
// export const getAttachmentUploads = (state: ChatAdapterState): _AttachmentUploadsUiState | undefined => {
//   /* @conditional-compile-remove(attachment-upload) */
//   return state?._attachmentUploads;
//   return undefined;
// };
