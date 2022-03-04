// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon } from '@fluentui/react';
import React from 'react';
import { FileCard } from './FileCard';
import { FileCardGroup } from './FileCardGroup';
import { extension, truncatedFileName } from './utils';

/**
 * @beta
 */
export interface FileUploadCardsProps {
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Optional array of active file uploads where each object has attibutes
   * of a file upload like name, progress, errormessage etc.
   * @beta
   */
  activeFileUploads?: ActiveFileUpload[];
  /**
   * Optional callback to remove the file upload before sending by clicking on
   * cancel icon.
   * @beta
   */
  cancelFileUpload?: (fileId: string) => void;
}

/**
 * Attributes required for SendBox to show file uploads like name, progress etc.
 * @beta
 */
export interface ActiveFileUpload {
  /**
   * Unique identifier for the file upload.
   */
  id: string;

  /**
   * File name to be rendered for uploaded file.
   */
  filename: string;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   */
  progress: number;

  /**
   * Error message to be displayed to the user if the upload fails.
   */
  errorMessage?: string;
}

/**
 * @beta
 */
export const FileUploadCards = (props: FileUploadCardsProps): JSX.Element => {
  const truncateLength = 15;
  const files = props.activeFileUploads;
  return (
    <FileCardGroup>
      {files &&
        files
          .filter((file) => !file.errorMessage)
          .map((file) => (
            <FileCard
              fileName={truncatedFileName(file.filename, truncateLength)}
              progress={file.progress}
              key={file.id}
              fileExtension={extension(file.filename)}
              actionIcon={<Icon iconName="Cancel" />}
              actionHandler={() => {
                props.cancelFileUpload && props.cancelFileUpload(file.id);
              }}
            />
          ))}
    </FileCardGroup>
  );
};

// const CancelIconTrampoline = (): JSX.Element => {
//   // @conditional-compile-remove(file-sharing)
//   return <ChatCompositeIcon iconName="Cancel" />;
//   // Return _some_ available icon, as the real icon is beta-only.
//   return <ChatCompositeIcon iconName="EditBoxCancel" />;
// };
