// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FileUploadManager } from './FileUpload';

/**
 * @beta
 * A callback function for handling file uploads.
 *
 * @param userId - The user ID of the user uploading the file.
 * @param fileUploads - The list of uploaded files. Each file is represented by an {@link FileUpload} object.
 */
export type FileUploadHandler = (userId: string, fileUploads: FileUploadManager[]) => void;
