// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon } from '@fluentui/react';
import React from 'react';
import { ActiveFileUpload } from './SendBox';
import { FileCard } from './FileCard';
import { FileCardGroup } from './FileCardGroup';
import { extension, truncatedFileName } from './utils';

/**
 * @beta
 */
export interface FileUploadCardsProps {
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
  onCancelFileUpload?: (fileId: string) => void;
}

/**
 * @beta
 */
export const FileUploadCards = (props: FileUploadCardsProps): JSX.Element => {
  const truncateLength = 15;
  const files = props.activeFileUploads;
  if (!files || files.length === 0) {
    return <></>;
  }
  return (
    <FileCardGroup>
      {files &&
        files
          .filter((file) => !file.error)
          .map((file) => (
            <FileCard
              fileName={truncatedFileName(file.filename, truncateLength)}
              progress={file.progress}
              key={file.id}
              fileExtension={extension(file.filename)}
              actionIcon={<Icon iconName="Cancel" />}
              actionHandler={() => {
                props.onCancelFileUpload && props.onCancelFileUpload(file.id);
              }}
            />
          ))}
    </FileCardGroup>
  );
};
