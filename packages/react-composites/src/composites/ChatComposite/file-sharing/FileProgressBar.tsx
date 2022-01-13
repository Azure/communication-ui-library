// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ProgressIndicator } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { UploadedFile } from './UploadedFile';
import React from 'react';

/**
 * @beta
 */
export interface FileProgressProps {
  uploadedFile: UploadedFile;
}

/**
 * @beta
 */
export const FileProgressBar = (props: FileProgressProps): JSX.Element => {
  const { uploadedFile } = props;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const uploadProgressedListener = (e: number): void => {
      setProgress(e);
    };

    uploadedFile.on('uploadProgressed', uploadProgressedListener);
    return () => {
      uploadedFile.off('uploadProgressed', uploadProgressedListener);
    };
  }, [uploadedFile]);

  return (
    <ProgressIndicator
      percentComplete={progress}
      styles={{
        itemProgress: {
          height: 0,
          padding: '2px 0',
          borderRadius: '0 0 4px 4px'
        }
      }}
    />
  );
};
