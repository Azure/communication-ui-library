// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Icon } from '@fluentui/react';
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

/**
 * @beta
 */
export interface FileDownloadCards {
  /**
   * User id for the message
   */
  userId: string;
  /**
   * Extension of the file used for rendering the file icon.
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
            actionIcon={<Icon iconName="Download" />}
            actionHandler={() => {
              props.downloadHandler && props.downloadHandler(userId, file);
              !props.downloadHandler && window.open(file.url, '_blank', 'noopener,noreferrer');
            }}
          />
        ))}
    </FileCardGroup>
  );
};
