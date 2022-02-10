// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { FileMetadata } from './FileUpload';

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
 *     throw new Error('You don’t have permission to download this file.');
 *   } else {
 *     return fileData.url;
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
 * @param userId - The {@link CommunicationIdentifierKind} ID of the user uploading the file.
 * @param fileData - The {@link FileMetadata} containing file `url`, `extension` and `name`.
 */
export type FileDownloadHandler = (userId: string, fileData: FileMetadata) => Promise<string>;
