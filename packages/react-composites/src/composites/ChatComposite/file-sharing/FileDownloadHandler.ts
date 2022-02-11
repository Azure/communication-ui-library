// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { FileMetadata } from './FileUpload';

/**
 * @beta
 * A file download error returned via a {@link FileDownloadHandler}.
 * This error message is used to render an error message in the UI.
 */
export interface FileDownloadError {
  errorMessage: string;
}

/**
 * @beta
 *
 * A callback function for handling file downloads.
 * The function needs to return a promise that resolves to a file download URL.
 * If the promise is rejected, the {@link Error.message} will be used to display an error message to the user.
 *
 * Sample Usage:
 * ```ts
 * const fileDownloadHandler: FileDownloadHandler = async (userId, fileData) => {
 *   if (isUnauthorizedUser(userId)) {
 *     return { errorMessage: 'You don’t have permission to download this file.' };
 *   } else {
 *     return new URL(fileData.url);
 *   }
 * }
 *
 * const App = () => (
 *   <ChatComposite
 *     ...
 *     fileSharing={{
 *       fileDownloadHandler: fileDownloadHandler
 *     }}
 *   />
 * )
 *
 * ```
 * @param userId - The user ID of the user downloading the file.
 * @param fileData - The {@link FileMetadata} containing file `url`, `extension` and `name`.
 */
export type FileDownloadHandler = (userId: string, fileData: FileMetadata) => Promise<URL | FileDownloadError>;
