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
export const getFileUploads = (state: ChatAdapterState): FileUploadState[] | undefined => {
  const fileUploads = state?.fileUploads;
  if (!fileUploads) {
    return undefined;
  }
  return Object.keys(fileUploads).map((key) => fileUploads[key]);
};

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const getFileUploadsCompleted = (state: ChatAdapterState): boolean | undefined => {
  const fileUploads = state?.fileUploads;
  if (!fileUploads) {
    return undefined;
  }
  return Object.keys(fileUploads).every((key) => !!fileUploads[key].metadata);
};
