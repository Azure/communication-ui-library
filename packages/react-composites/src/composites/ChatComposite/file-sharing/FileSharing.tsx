// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

/**
 *
 */
export interface FileMeta {
  name: string;
  mimetype: string;
  url: string;
}

/**
 *
 */
export interface UploadedFile {
  file: File;
  progress: number;
  meta?: FileMeta;
}

/**
 *
 */
export type FileUploadHandler = (userId: string, file: UploadedFile) => void;

/**
 *
 */
export type FileDownloadHandler = (userId: string, fileMeta: FileMeta) => string;

/**
 *
 */
export class UploadedFile implements UploadedFile {
  constructor(file: File) {
    this.file = file;
    this.progress = 0;
  }
}

/**
 *
 */
export const UploadButton = (props: { fileUploadHandler: FileUploadHandler }): JSX.Element => {
  const userId = 'sampleUserId';

  const { fileUploadHandler } = props;

  const onChange = (files: FileList | null): void => {
    if (!files) {
      return;
    }

    for (const file of files) {
      const uploadedFile = new UploadedFile(file);
      fileUploadHandler(userId, uploadedFile);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => {
        onChange(e.currentTarget.files);
      }}
    />
  );
};
