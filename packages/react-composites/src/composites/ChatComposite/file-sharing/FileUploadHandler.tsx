// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FileUploadManager } from './FileUpload';

/**
 * @beta
 * A callback function for handling file uploads.
 *
 * @param fileUploads - The list of uploaded files. Each file is represented by an {@link FileUpload} object.
 */
export type FileUploadHandler = (fileUploads: FileUploadManager[]) => void;
