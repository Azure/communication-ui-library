// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatAdapterState } from '../adapter/ChatAdapter';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { FileUploadState } from '../file-sharing';

/**
 * @private
 */
export const getUserId = (state: ChatAdapterState): CommunicationIdentifierKind => state.userId;

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const getFileUploads = (state: ChatAdapterState): FileUploadState[] | undefined => state.fileUploads;

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const getFileUploadsCompleted = (state: ChatAdapterState): boolean | undefined =>
  state?.fileUploads?.map((file) => !!file.metadata).reduce((a, b) => a && b);
