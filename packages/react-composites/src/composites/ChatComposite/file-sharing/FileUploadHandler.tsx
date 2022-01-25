// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { UploadedFile } from './UploadedFile';

/**
 * @beta
 * A callback function for handling file uploads.
 *
 * @param userId The user ID of the user uploading the file.
 * @param uploadedFiles The list of uploaded files. Each file is represented by an {@link UploadedFile} object.
 */
export type FileUploadHandler = (userId: CommunicationIdentifierKind, uploadedFiles: UploadedFile[]) => void;
