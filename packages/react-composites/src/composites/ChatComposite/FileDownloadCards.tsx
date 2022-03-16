// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Spinner, SpinnerSize } from '@fluentui/react';
import { ChatMessage, _FileCard, _FileCardGroup } from '@internal/react-components';
import React, { useCallback, useState } from 'react';
import { ChatCompositeIcon } from '../common/icons';
import { extension, extractFileMetadata, FileDownloadHandler, FileMetadata } from './file-sharing';

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
   * Callback to update download error message.
   */
  onDownloadErrorMessage: (errMsg: string) => void;
  /**
   * A function of type {@link FileDownloadHandler} for handling file downloads.
   * If the function is not specified, the file's `url` will be opened in a new tab to
   * initiate the download.
   */
  downloadHandler?: FileDownloadHandler;
}

/**
 * @TODO Move to react-components as an internal component.
 * @beta
 */
export const FileDownloadCards = (props: FileDownloadCards): JSX.Element => {
  const { userId, message } = props;
  const [showSpinner, setShowSpinner] = useState(false);
  const fileDownloads: FileMetadata[] = message.metadata ? extractFileMetadata(message.metadata) : [];
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
            props.onDownloadErrorMessage(response.errorMessage);
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
  );
};

const DownloadIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(file-sharing)
  return <ChatCompositeIcon iconName="Download" />;
  // Return _some_ available icon, as the real icon is beta-only.
  return <ChatCompositeIcon iconName="EditBoxCancel" />;
};
