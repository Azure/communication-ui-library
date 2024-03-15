// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AttachmentUploadManager } from './AttachmentUpload';

/**
 * @beta
 * A callback function for handling file uploads.
 *
 * @param AttachmentUploads - The list of uploaded files. Each file is represented by an {@link AttachmentUpload} object.
 */
export type AttachmentUploadHandler = (attachmentUploads: AttachmentUploadManager[]) => void;
