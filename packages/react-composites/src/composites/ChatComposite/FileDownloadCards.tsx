// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  FileCard,
  FileCardGroup,
  truncatedFileName,
  extension,
  FileMetadata,
  extractFileMetadata,
  FileDownloadHandler,
  FileDownloadErrorMessage
} from './file-sharing';
import { ChatMessage } from '@internal/react-components';
import { ChatCompositeIcon } from '../common/icons';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { useState } from 'react';
import React from 'react';

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
  const [showSpinner, setShowSpinner] = useState(false);
  const fileDownloads: FileMetadata[] = message.metadata ? extractFileMetadata(message.metadata) : [];
  return (
    <FileCardGroup>
      {fileDownloads &&
        fileDownloads.map((file) => (
          <FileCard
            fileName={truncatedFileName(file.name, truncateLength)}
            key={file.name}
            fileExtension={extension(file.name)}
            actionIcon={
              showSpinner ? (
                <Spinner size={SpinnerSize.medium} aria-live={'assertive'} />
              ) : (
                <ChatCompositeIcon iconName="Download" />
              )
            }
            actionHandler={() => {
              if (props.downloadHandler) {
                setShowSpinner(true);
                props
                  .downloadHandler(userId, file)
                  .then((value: URL | FileDownloadErrorMessage) => {
                    if (value instanceof URL) {
                      window.open(value.toString(), '_blank', 'noopener,noreferrer');
                    } else {
                      //TODO: implement error handling for reject
                      console.log(value);
                    }
                  })
                  .finally(() => {
                    setShowSpinner(false);
                  });
              }
              !props.downloadHandler && window.open(file.url, '_blank', 'noopener,noreferrer');
            }}
          />
        ))}
    </FileCardGroup>
  );
};
