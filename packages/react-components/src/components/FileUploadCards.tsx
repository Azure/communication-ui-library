// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon } from '@fluentui/react';
import React from 'react';
import { ActiveFileUpload } from './SendBox';
import { _FileCard } from './FileCard';
import { _FileCardGroup } from './FileCardGroup';
import { extension } from './utils';

/**
 * @internal
 */
export interface FileUploadCardsProps {
  /**
   * Optional array of active file uploads where each object has attibutes
   * of a file upload like name, progress, errormessage etc.
   */
  activeFileUploads?: ActiveFileUpload[];
  /**
   * Optional callback to remove the file upload before sending by clicking on
   * cancel icon.
   */
  onCancelFileUpload?: (fileId: string) => void;
}

/**
 * @internal
 */
export const _FileUploadCards = (props: FileUploadCardsProps): JSX.Element => {
  const files = props.activeFileUploads;
  if (!files || files.length === 0) {
    return <></>;
  }
  return (
    <_FileCardGroup>
      {files &&
        files
          .filter((file) => !file.error)
          .map((file) => (
            <_FileCard
              fileName={file.filename}
              progress={file.progress}
              key={file.id}
              fileExtension={extension(file.filename)}
              actionIcon={<Icon iconName="Cancel" />}
              actionHandler={() => {
                props.onCancelFileUpload && props.onCancelFileUpload(file.id);
              }}
            />
          ))}
    </_FileCardGroup>
  );
};
