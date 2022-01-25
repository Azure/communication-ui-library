// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { Icon, mergeStyles, Stack, useTheme } from '@fluentui/react';
import React, { useRef } from 'react';
import { FileUploadHandler } from './FileUploadHandler';
import { UploadedFile } from './UploadedFile';

/**
 * Props for {@link FileUploadButton} component.
 * @internal
 */
export interface FileUploadButtonProps {
  /**
   * The ACS user ID of the user uploading the file.
   */
  userId: CommunicationIdentifierKind;
  /**
   * The function of type {@link FileUploadHandler} for handling file uploads.
   */
  fileUploadHandler?: FileUploadHandler;
  /**
   * A string containing the comma separated list of accepted file types.
   * Similar to the `accept` attribute of the `<input type="file" />` element.
   */
  accept?: string;
  /**
   * Allows multiple files to be selected if set to `true`.
   * Default value is `false`.
   */
  multiple?: boolean;
}

/**
 * @internal
 */
export const FileUploadButton = (props: FileUploadButtonProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const { userId, fileUploadHandler, accept, multiple = false } = props;

  const onChange = (files: FileList | null): void => {
    if (!files) {
      return;
    }

    const uploadedFiles: UploadedFile[] = [];

    for (const file of files) {
      const uploadedFile = new UploadedFile(file);
      uploadedFiles.push(uploadedFile);
    }

    fileUploadHandler && fileUploadHandler(userId, uploadedFiles);
  };

  const fileUploadButtonClassName = mergeStyles({
    width: '1.5rem',
    height: '1.5rem',
    cursor: 'pointer',
    padding: '0.15rem',
    ':hover': {
      backgroundColor: theme.palette.neutralLighter
    }
  });

  return (
    <>
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        className={fileUploadButtonClassName}
        onClick={() => inputRef.current?.click()}
      >
        <Icon iconName="AttachFile" />
      </Stack>
      <input
        ref={inputRef}
        hidden
        multiple={multiple}
        accept={accept}
        type="file"
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.currentTarget.files);
        }}
      />
    </>
  );
};
