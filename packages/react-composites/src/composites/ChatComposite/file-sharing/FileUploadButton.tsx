// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { mergeStyles, Stack, useTheme } from '@fluentui/react';
import React, { useRef } from 'react';
import { ChatCompositeIcon } from '../../common/icons';

/**
 * Props for {@link FileUploadButton} component.
 * @internal
 */
export interface FileUploadButtonProps {
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
  /**
   * onChange handler for the file upload button.
   * Similar to the `onChange` attribute of the `<input type="file" />` element.
   * Called every time files are selected through the file upload button with a {@link FileList}
   * of selected files.
   */
  onChange?: (files: FileList | null) => void;
}

/**
 * @internal
 */
export const FileUploadButton = (props: FileUploadButtonProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const { accept, multiple = false, onChange } = props;

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
        <ChatCompositeIcon iconName={safeGetSendBoxAttachFileIconName()} />
      </Stack>
      <input
        ref={inputRef}
        hidden
        multiple={multiple}
        accept={accept}
        type="file"
        onChange={(e) => {
          onChange && onChange(e.currentTarget.files);
        }}
      />
    </>
  );
};

// Remove safe getter when conditional-compile-remove(file-sharing) is removed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeGetSendBoxAttachFileIconName = (): any => 'SendBoxAttachFile';

/**
 * A wrapper to return {@link FileUploadButton} component conditionally.
 * It will return `<></>` for stable builds.
 * @internal
 */
export const FileUploadButtonWrapper = (
  // To make conditional compilation not throw errors.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: Pick<FileUploadButtonProps, 'accept' | 'multiple' | 'onChange'>
): JSX.Element => {
  return (
    <>
      {
        /* @conditional-compile-remove(file-sharing) */
        <FileUploadButton {...props} />
      }
    </>
  );
};
