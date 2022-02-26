// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Icon } from '@fluentui/react';
import { FileCard, FileCardGroup, truncatedFileName, extension } from './file-sharing';
import { useFileUploadAdapter } from './adapter/ChatAdapterProvider';
import React from 'react';
import { useSelector } from './hooks/useSelector';
import { fileUploadsSelector } from './selectors/fileUploadsSelector';

/**
 * @beta
 */
export const FileUploadCards = (): JSX.Element => {
  const truncateLength = 15;
  const adapter = useFileUploadAdapter();
  const { files } = useSelector(fileUploadsSelector);
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
                adapter.cancelFileUpload && adapter.cancelFileUpload(file.id);
              }}
            />
          ))}
    </FileCardGroup>
  );
};
