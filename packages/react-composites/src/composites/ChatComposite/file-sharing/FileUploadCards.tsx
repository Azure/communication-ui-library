// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Icon } from '@fluentui/react';
import { FileCard, FileCardGroup, FileUploadState } from '../file-sharing';
import { useAdapter } from '../adapter/ChatAdapterProvider';
import React from 'react';

/**
 * @beta
 */
export interface FileUploadCardsProps {
  /**
   * Uploaded files
   */
  uploadedFiles: FileUploadState[];
  /**
   * Mehod to truncate filename if the length is greater than passed length
   */
  truncatedFileName(filename: string, truncateLength: number): string;
  /**
   * Method to return extension for given filename
   */
  extension(filename: string): string;
}

/**
 * @beta
 */
export const FileUploadCards = (props: FileUploadCardsProps): JSX.Element => {
  const { uploadedFiles, truncatedFileName, extension } = props;
  const truncateLength = 15;
  const adapter = useAdapter();

  return (
    <FileCardGroup>
      {uploadedFiles &&
        uploadedFiles.map((file) => (
          <FileCard
            fileName={truncatedFileName(file.filename, truncateLength)}
            progress={file.progress}
            key={file.id}
            fileExtension={extension(file.filename)}
            actionIcon={<Icon iconName="Cancel" />}
            actionHandler={() => {
              adapter.cancelFileUpload && adapter.cancelFileUpload(file.id);
            }}
          />
        ))}
    </FileCardGroup>
  );
};
