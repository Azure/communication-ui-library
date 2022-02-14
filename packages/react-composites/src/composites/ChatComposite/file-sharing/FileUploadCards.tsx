// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Icon } from '@fluentui/react';
import { FileCard, FileCardGroup, FileUploadState, truncatedFileName, extension } from '../file-sharing';
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
}

/**
 * @beta
 */
export const FileUploadCards = (props: FileUploadCardsProps): JSX.Element => {
  const { uploadedFiles } = props;
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
