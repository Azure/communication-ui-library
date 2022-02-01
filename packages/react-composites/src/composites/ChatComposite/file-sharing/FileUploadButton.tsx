// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { Icon, mergeStyles, Stack, useTheme } from '@fluentui/react';
import React, { useRef } from 'react';
import { FileUploadHandler } from './FileUploadHandler';
import { FileUpload } from './FileUpload';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { useSelector } from '../hooks/useSelector';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { fileUploadButtonSelector } from '../selectors/fileUploadButtonSelector';

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
   * Similar to the `multiple` attribute of the `<input type="file" />` element.
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

    const fileUploads = Array.from(files).map((file) => new FileUpload(file));
    fileUploadHandler && fileUploadHandler(userId, fileUploads);
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
        <Icon iconName="SendBoxAttachFile" />
      </Stack>
      <input
        ref={inputRef}
        hidden
        multiple={multiple}
        accept={accept}
        type="file"
        onChange={(e) => {
          onChange(e.currentTarget.files);
        }}
      />
    </>
  );
};

/**
 * A wrapper to return {@link FileUploadButton} component conditionally.
 * It will return `<></>` for stable builds.
 * @internal
 */
export const FileUploadButtonWrapper = (
  // To make conditional compilation not throw errors.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: Pick<FileUploadButtonProps, 'accept' | 'multiple' | 'fileUploadHandler'>
): JSX.Element => {
  /* @conditional-compile-remove-from(stable): FILE_SHARING */
  const fileUploadButtonProps = useSelector(fileUploadButtonSelector);
  return (
    <>
      {
        /* @conditional-compile-remove-from(stable): FILE_SHARING */
        <FileUploadButton {...fileUploadButtonProps} {...props} />
      }
    </>
  );
};
