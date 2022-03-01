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
  const [showSpinner, setSpinner] = useState(false);
  const fileDownloads: FileMetadata[] = message.metadata ? extractFileMetadata(message.metadata) : [];
  const DownloadIconTrampoline = (): JSX.Element => {
    // @conditional-compile-remove(file-sharing)
    if (showSpinner) {
      // @conditional-compile-remove(file-sharing)
      return <Spinner size={SpinnerSize.medium} aria-live={'assertive'} />;
    } else {
      // @conditional-compile-remove(file-sharing)
      return <ChatCompositeIcon iconName="Download" />;
    }
    // Return _some_ available icon, as the real icon is beta-only.
    return <ChatCompositeIcon iconName="EditBoxCancel" />;
  };
  return (
    <FileCardGroup>
      {fileDownloads &&
        fileDownloads.map((file) => (
          <FileCard
            fileName={truncatedFileName(file.name, truncateLength)}
            key={file.name}
            fileExtension={extension(file.name)}
            actionIcon={<DownloadIconTrampoline />}
            actionHandler={() => {
              if (props.downloadHandler) {
                setSpinner(true);
                props
                  .downloadHandler(userId, file)
                  .then((fileurl) => {
                    setSpinner(false);
                    window.open(fileurl.toString(), '_blank', 'noopener,noreferrer');
                  })
                  .catch((error) => {
                    setSpinner(false);
                    //TODO: implement error handling for reject
                    console.log(error);
                  });
              }
              !props.downloadHandler && window.open(file.url, '_blank', 'noopener,noreferrer');
            }}
          />
        ))}
    </FileCardGroup>
  );
};
