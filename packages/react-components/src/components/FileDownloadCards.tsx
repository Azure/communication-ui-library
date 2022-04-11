// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Icon, Spinner, SpinnerSize } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import { ChatMessage } from '../types';
import { _FileCard } from './FileCard';
import { _FileCardGroup } from './FileCardGroup';
import { extension } from './utils';

/**
 * Meta Data containing information about the uploaded file.
 * @beta
 */
export interface FileMetadata {
  /**
   * File name to be displayed.
   */
  name: string;
  /**
   * Extension is used for rendering the file icon.
   * An unknown extension will be rendered as a generic icon.
   * Example: `jpeg`
   */
  extension: string;
  /**
   * Download URL for the file.
   */
  url: string;
}

/**
 * @beta
 * A file download error returned via a {@link FileDownloadHandler}.
 * This error message is used to render an error message in the UI.
 */
export interface FileDownloadError {
  /** The error message to display in the UI */
  errorMessage: string;
}

/**
 * @internal
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
 * @param fileMetadata - The {@link FileMetadata} containing file `url`, `extension` and `name`.
 */
export type FileDownloadHandler = (userId: string, fileMetadata: FileMetadata) => Promise<URL | FileDownloadError>;

/**
 * @internal
 */
export interface _FileDownloadCards {
  /**
   * User id of the local participant
   */
  userId: string;
  /**
   * A chat message that inculdes file metadata
   */
  message: ChatMessage;
  /**
   * A function of type {@link FileDownloadHandler} for handling file downloads.
   * If the function is not specified, the file's `url` will be opened in a new tab to
   * initiate the download.
   */
  downloadHandler?: FileDownloadHandler;
  /**
   * Property name that contains information about file downloads in `message.metadata` object.
   * @defaultValue fileSharingMetadata
   */
  fileDownloadMetadataKey?: string;
  /**
   * Optional callback that runs if downloadHandler returns {@link FileDownloadError}.
   */
  onDownloadErrorMessage?: (errMsg: string) => void;
}

/**
 * @private
 */
const extractFileMetadata = (metadata: Record<string, string>, key: string): FileMetadata[] => {
  return metadata[key] ? JSON.parse(metadata[key]) : [];
};

/**
 * @internal
 */
export const _FileDownloadCards = (props: _FileDownloadCards): JSX.Element => {
  const { userId, message, fileDownloadMetadataKey = 'fileSharingMetadata' } = props;
  const [showSpinner, setShowSpinner] = useState(false);
  const fileDownloads: FileMetadata[] = message.metadata
    ? extractFileMetadata(message.metadata, fileDownloadMetadataKey)
    : [];
  const fileDownloadHandler = useCallback(
    async (userId, file) => {
      if (!props.downloadHandler) {
        window.open(file.url, '_blank', 'noopener,noreferrer');
      } else {
        setShowSpinner(true);
        try {
          const response = await props.downloadHandler(userId, file);
          setShowSpinner(false);
          if (response instanceof URL) {
            window.open(response.toString(), '_blank', 'noopener,noreferrer');
          } else {
            props.onDownloadErrorMessage && props.onDownloadErrorMessage(response.errorMessage);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setShowSpinner(false);
        }
      }
    },
    [props]
  );

  if (!fileDownloads || fileDownloads.length === 0) {
    return <></>;
  }

  return (
    <div style={{ marginTop: '0.25rem' }} data-ui-id="file-download-card-group">
      <_FileCardGroup>
        {fileDownloads &&
          fileDownloads.map((file) => (
            <_FileCard
              fileName={file.name}
              key={file.name}
              fileExtension={extension(file.name)}
              actionIcon={
                showSpinner ? <Spinner size={SpinnerSize.medium} aria-live={'assertive'} /> : <DownloadIconTrampoline />
              }
              actionHandler={() => fileDownloadHandler(userId, file)}
            />
          ))}
      </_FileCardGroup>
    </div>
  );
};

/**
 * @private
 */
const DownloadIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(file-sharing)
  return <Icon data-ui-id="file-download-card-download-icon" iconName="Download" />;
  // Return _some_ available icon, as the real icon is beta-only.
  return <Icon iconName="EditBoxCancel" />;
};
