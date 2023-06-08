// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, IconButton } from '@fluentui/react';
import React from 'react';
import { ActiveFileUpload } from './SendBox';
import { _FileCard } from './FileCard';
import { _FileCardGroup } from './FileCardGroup';
import { extension } from './utils';
import { iconButtonClassName } from './styles/IconButton.styles';
import { useMemo } from 'react';
import { useLocaleFileCardStringsTrampoline } from './utils/common';

/**
 * Strings of _FileUploadCards that can be overridden.
 *
 * @internal
 */
export interface _FileUploadCardsStrings {
  /** Aria label to notify user when focus is on cancel file upload button. */
  removeFile: string;
  /** Aria label to notify user file uploading starts. */
  uploading: string;
  /** Aria label to notify user file is uploaded. */
  uploadCompleted: string;
}

/**
 * @internal
 */
export interface FileUploadCardsProps {
  /**
   * Optional array of active file uploads where each object has attibutes
   * of a file upload like name, progress, errormessage etc.
   */
  activeFileUploads?: ActiveFileUpload[];
  /**
   * Optional callback to remove the file upload before sending by clicking on
   * cancel icon.
   */
  onCancelFileUpload?: (fileId: string) => void;
  /**
   * Optional arialabel strings for file upload cards
   */
  strings?: _FileUploadCardsStrings;
}

const actionIconStyle = { height: '1rem' };

/**
 * @internal
 */
export const _FileUploadCards = (props: FileUploadCardsProps): JSX.Element => {
  const files = props.activeFileUploads;

  const localeStrings = useLocaleFileCardStringsTrampoline();

  const removeFileButtonString = useMemo(
    () => () => {
      return props.strings?.removeFile ?? localeStrings.removeFile;
    },
    [props.strings?.removeFile, localeStrings.removeFile]
  );

  if (!files || files.length === 0) {
    return <></>;
  }

  return (
    <_FileCardGroup>
      {files &&
        files
          .filter((file) => !file.error)
          .map((file) => (
            <_FileCard
              fileName={file.filename}
              progress={file.progress}
              key={file.id}
              fileExtension={extension(file.filename)}
              actionIcon={
                <IconButton className={iconButtonClassName} ariaLabel={removeFileButtonString()}>
                  <Icon iconName="CancelFileUpload" style={actionIconStyle} />
                </IconButton>
              }
              actionHandler={() => {
                props.onCancelFileUpload && props.onCancelFileUpload(file.id);
              }}
              strings={props.strings}
            />
          ))}
    </_FileCardGroup>
  );
};
