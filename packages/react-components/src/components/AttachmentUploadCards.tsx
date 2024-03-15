// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon } from '@fluentui/react';
import React from 'react';
import { _AttachmentCard } from './AttachmentCard';
import { _AttachmentCardGroup } from './AttachmentCardGroup';
// import { extension } from './utils';
// import { iconButtonClassName } from './styles/IconButton.styles';
import { useMemo } from 'react';
import { useLocaleFileCardStringsTrampoline } from './utils/common';
import { AttachmentMetadata } from './AttachmentDownloadCards';

/**
 * Strings of _AttachmentUploadCards that can be overridden.
 *
 * @internal
 */
export interface _AttachmentUploadCardsStrings {
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
export interface _AttachmentUploadCardsProps {
  /**
   * Optional array of active file uploads where each object has attibutes
   * of a file upload like name, progress, errormessage etc.
   */
  activeAttachmentUploads?: AttachmentMetadata[];
  /**
   * Optional callback to remove the file upload before sending by clicking on
   * cancel icon.
   */
  onCancelAttachmentUpload?: (fileId: string) => void;
  /**
   * Optional arialabel strings for file upload cards
   */
  strings?: _AttachmentUploadCardsStrings;
}

const actionIconStyle = { height: '1rem' };

/**
 * @internal
 */
export const _AttachmentUploadCards = (props: _AttachmentUploadCardsProps): JSX.Element => {
  const files = props.activeAttachmentUploads;

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
    <_AttachmentCardGroup>
      {files &&
        files
          .filter((file) => !file.error)
          .map((file) => (
            <_AttachmentCard
              file={file}
              progress={file.progress}
              key={file.id}
              menuActions={[
                {
                  name: 'remove',
                  icon: (
                    <div aria-label={removeFileButtonString()}>
                      <Icon iconName="CancelAttachmentUpload" style={actionIconStyle} />
                    </div>
                  ),
                  onClick: () => {
                    props.onCancelAttachmentUpload && props.onCancelAttachmentUpload(file.id);
                  }
                }
              ]}
            />
          ))}
    </_AttachmentCardGroup>
  );
};
