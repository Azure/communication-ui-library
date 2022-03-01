// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FileCard, FileCardGroup, truncatedFileName, extension } from './file-sharing';
import { useFileUploadAdapter } from './adapter/ChatAdapterProvider';
import React from 'react';
import { useSelector } from './hooks/useSelector';
import { fileUploadsSelector } from './selectors/fileUploadsSelector';
import { ChatCompositeIcon } from '../common/icons';

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
              actionIcon={<CancelIconTrampoline />}
              actionHandler={() => {
                adapter.cancelFileUpload && adapter.cancelFileUpload(file.id);
              }}
            />
          ))}
    </FileCardGroup>
  );
};

const CancelIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(file-sharing)
  return <ChatCompositeIcon iconName="Cancel" />;
  // Return _some_ available icon, as the real icon is beta-only.
  return <ChatCompositeIcon iconName="EditBoxCancel" />;
};
