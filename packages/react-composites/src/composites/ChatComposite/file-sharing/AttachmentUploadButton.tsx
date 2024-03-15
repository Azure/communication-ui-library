// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IconButton, mergeStyles, Stack, useTheme } from '@fluentui/react';
import React from 'react';
import { ChatCompositeIcon } from '../../common/icons';
/* @conditional-compile-remove(file-sharing) */
import { useLocale } from '../../localization';

/**
 * Props for {@link AttachmentUploadButton} component.
 * @internal
 */
export interface AttachmentUploadButtonProps {
  /**
   * A string containing the comma separated list of accepted file types.
   * Similar to the `accept` attribute of the `<input type="file" />` element.
   */
  acceptedMimeTypes?: string[];
  /**
   * Allows multiple files to be selected if set to `true`.
   * Default value is `false`.
   * Similar to the `multiple` attribute of the `<input type="file" />` element.
   */
  canUploadMultiple?: boolean;
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
export const AttachmentUploadButton = (props: AttachmentUploadButtonProps): JSX.Element => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const { acceptedMimeTypes, canUploadMultiple = false, onChange } = props;

  const attachmentUploadButtonClassName = mergeStyles({
    width: '1.5rem',
    height: '1.5rem',
    cursor: 'pointer',
    padding: '0.15rem',
    ':hover': {
      backgroundColor: theme.palette.neutralLighter
    }
  });

  const iconButtonClassName = mergeStyles({
    color: 'unset',
    width: '1.5rem',
    height: '1.5rem',
    ':hover': {
      color: 'unset',
      background: 'transparent'
    }
  });

  return (
    <>
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        className={attachmentUploadButtonClassName}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <IconButton className={iconButtonClassName} ariaLabel={uploadFileButtonStringTrampoline()}>
          <SendBoxAttachFileIconTrampoline />
        </IconButton>
      </Stack>
      <input
        ref={inputRef}
        hidden
        multiple={canUploadMultiple}
        accept={acceptedMimeTypes?.join(',')}
        type="file"
        onClick={(e) => {
          // To ensure that `onChange` is fired even if the same file is picked again.
          e.currentTarget.value = '';
        }}
        onChange={(e) => {
          onChange && onChange(e.currentTarget.files);
        }}
      />
    </>
  );
};

const SendBoxAttachFileIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(file-sharing)
  return <ChatCompositeIcon iconName="SendBoxAttachFile" />;
  // Return _some_ available icon, as the real icon is beta-only.
  return <ChatCompositeIcon iconName="EditBoxCancel" />;
};

/**
 * A wrapper to return {@link AttachmentUploadButton} component conditionally.
 * It will return `<></>` for stable builds.
 * @internal
 */
export const AttachmentUploadButtonWrapper = (
  // To make conditional compilation not throw errors.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: Pick<AttachmentUploadButtonProps, 'acceptedMimeTypes' | 'canUploadMultiple' | 'onChange'>
): JSX.Element => {
  return (
    <>
      {
        /* @conditional-compile-remove(file-sharing) */
        <AttachmentUploadButton {...props} />
      }
    </>
  );
};

const uploadFileButtonStringTrampoline = (): string => {
  //@conditional-compile-remove(file-sharing)
  //eslint-disable-next-line react-hooks/rules-of-hooks
  return useLocale().strings.chat.uploadFile;
  return '';
};
