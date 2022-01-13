// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Icon, mergeStyles, Stack } from '@fluentui/react';
import { useRef } from 'react';
import { UploadedFile } from './UploadedFile';
import React from 'react';
import { useAdapter } from '../adapter/ChatAdapterProvider';

/**
 * @beta
 */
export type FileUploadHandler = (userId: string, uploadedFiles: UploadedFile[]) => void;

/**
 * @beta
 */
export interface FileUploadButtonProps {
  userId: string;
  fileUploadHandler?: FileUploadHandler;
  accept?: string;
}

/**
 * @beta
 */
export const FileUploadButton = (props: FileUploadButtonProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { userId, fileUploadHandler, accept } = props;
  const adapter = useAdapter();

  const onChange = (files: FileList | null): void => {
    if (!files) {
      return;
    }

    console.log('FILES ADDED: ', files);
    const uploadedFiles: UploadedFile[] = [];

    for (const file of files) {
      const uploadedFile = new UploadedFile(file);
      uploadedFiles.push(uploadedFile);
    }

    console.log('UPLOADED FILES: ', uploadedFiles);
    // Set files in adapter ui state.
    adapter.uploadFiles && adapter.uploadFiles(uploadedFiles);

    fileUploadHandler && fileUploadHandler(userId, uploadedFiles);
  };

  const onClick = (): void => {
    inputRef.current?.click();
  };

  const inputElement = (
    <input
      ref={inputRef}
      hidden
      multiple
      accept={accept}
      type="file"
      onChange={(e) => {
        e.stopPropagation();
        onChange(e.currentTarget.files);
      }}
    />
  );

  return (
    <Stack
      verticalAlign="center"
      horizontalAlign="center"
      className={mergeStyles({
        width: '1.5rem',
        height: '1.5rem',
        cursor: 'pointer',
        padding: '0.15rem',
        ':hover': {
          backgroundColor: '#eaeaea'
        }
      })}
      onClick={onClick}
    >
      <Icon iconName="Attach" />
      {inputElement}
    </Stack>
  );
};
