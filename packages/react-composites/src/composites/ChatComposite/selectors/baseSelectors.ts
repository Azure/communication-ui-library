// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatAdapterState } from '../adapter/ChatAdapter';
import { UploadedFile } from '../file-sharing';

/**
 * @private
 */
export const getUserId = (state: ChatAdapterState): CommunicationIdentifierKind => state.userId;

/**
 * @private
 */
export const getUploadedFiles = (state: ChatAdapterState): UploadedFile[] | undefined => state.uploadedFiles;

/**
 * @private
 */
export const getUploadedFilesCompleted = (state: ChatAdapterState): boolean => !!state.uploadedFilesCompleted;
