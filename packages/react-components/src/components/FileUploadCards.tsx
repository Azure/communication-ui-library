// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, IconButton } from '@fluentui/react';
import React from 'react';
import { ActiveFileUpload } from './SendBox';
import { _FileCard } from './FileCard';
import { _FileCardGroup } from './FileCardGroup';
import { extension } from './utils';
import { iconButtonClassName } from './styles/IconButton.styles';
// @conditional-compile-remove(file-sharing)
import { useLocale } from '../localization';

/**
 * Strings of _FileUploadCards that can be overridden.
 *
 * @beta
 */
export interface FileUploadCardsStrings {
  /** Aria label to notify user when focus is on cancel file upload button. */
  removeFile?: string;
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
}

const actionIconStyle = { height: '1rem' };

/**
 * @internal
 */
export const _FileUploadCards = (props: FileUploadCardsProps): JSX.Element => {
  const files = props.activeFileUploads;
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
              actionIcon={<UploadIconTrampoline />}
              actionHandler={() => {
                props.onCancelFileUpload && props.onCancelFileUpload(file.id);
              }}
            />
          ))}
    </_FileCardGroup>
  );
};

/**
 * @private
 */
const UploadIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(file-sharing)
  const localeStrings = useLocale().strings.fileUploadCards;
  // @conditional-compile-remove(file-sharing)
  return (
    <IconButton className={iconButtonClassName} ariaLabel={localeStrings.removeFile}>
      <Icon iconName="CancelFileUpload" style={actionIconStyle} />
    </IconButton>
  );
  // Return cancel button without aria label
  return (
    <IconButton className={iconButtonClassName}>
      <Icon iconName="CancelFileUpload" style={actionIconStyle} />
    </IconButton>
  );
};
