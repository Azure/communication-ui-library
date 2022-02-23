// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  FileCard,
  FileCardGroup,
  truncatedFileName,
  extension,
  FileMetadata,
  extractFileMetadata,
  FileDownloadHandler
} from './file-sharing';
import React from 'react';
import { ChatMessage } from '@internal/react-components';
import { ChatCompositeIcon } from '../common/icons';

/**
 * @beta
 */
export interface FileDownloadCards {
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
}

/**
 * @beta
 */
export const FileDownloadCards = (props: FileDownloadCards): JSX.Element => {
  const truncateLength = 15;
  const { userId, message } = props;
  const fileDownloads: FileMetadata[] = message.metadata ? extractFileMetadata(message.metadata) : [];
  return (
    <FileCardGroup>
      {fileDownloads &&
        fileDownloads.map((file) => (
          <FileCard
            fileName={truncatedFileName(file.name, truncateLength)}
            key={file.name}
            fileExtension={extension(file.name)}
            actionIcon={<ChatCompositeIcon iconName="Download" />}
            actionHandler={() => {
              props.downloadHandler && props.downloadHandler(userId, file);
              !props.downloadHandler && window.open(file.url, '_blank', 'noopener,noreferrer');
            }}
          />
        ))}
    </FileCardGroup>
  );
};
