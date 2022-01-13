// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import { UploadedFile } from './UploadedFile';
import { FileCard } from '@internal/react-components';

/**
 * @beta
 */
export interface UploadedFileCardProps {
  uploadedFile: UploadedFile;
}

/**
 * @beta
 */
export const UploadedFileCard = (props: UploadedFileCardProps): JSX.Element => {
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
    <FileCard fileName={uploadedFile.truncatedName()} fileExtension={uploadedFile.extension()} progress={progress} />
  );
};
