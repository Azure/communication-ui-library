// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { UploadedFile } from '..';
import { ChatAdapterState } from '../adapter/ChatAdapter';

/**
 * @private
 */
export const getUploadedFiles = (state: ChatAdapterState): UploadedFile[] | undefined => state.uploadedFiles;

/**
 * @private
 */
export const getUploadedFilesCompleted = (state: ChatAdapterState): boolean => !!state.uploadedFilesCompleted;
