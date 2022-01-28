// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatAdapterState } from '../adapter/ChatAdapter';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { UploadedFile } from '../file-sharing';

/**
 * @private
 */
export const getUserId = (state: ChatAdapterState): CommunicationIdentifierKind => state.userId;

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const getUploadedFiles = (state: ChatAdapterState): UploadedFile[] | undefined => state.uploadedFiles;

/* @conditional-compile-remove-from(stable): FILE_SHARING */
/**
 * @private
 */
export const getUploadedFilesCompleted = (state: ChatAdapterState): boolean => !!state.uploadedFilesCompleted;
