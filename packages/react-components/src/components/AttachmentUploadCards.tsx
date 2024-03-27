// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon } from '@fluentui/react';
import React, { useMemo } from 'react';
import { _AttachmentCard } from './AttachmentCard';
import { _AttachmentCardGroup } from './AttachmentCardGroup';
import { extension } from './utils';
import { SendBoxErrorBarError } from './SendBoxErrorBar';
import { useLocaleAttachmentCardStringsTrampoline } from './utils/common';

/**
 * Attributes required for SendBox to show attachment uploads like name, progress etc.
 * @beta
 */
export interface ActiveFileUpload {
  /**
   * Unique identifier for the file upload.
   */
  id: string;

  /**
   * File name to be rendered for uploaded file.
   */
  filename: string;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   * This is unrelated to the `uploadComplete` property.
   * It is only used to show the progress of the upload.
   * Progress of 1 doesn't mark the upload as complete, set the `uploadComplete`
   * property to true to mark the upload as complete.
   */
  progress: number;

  /**
   * Error to be displayed to the user if the upload fails.
   */
  error?: SendBoxErrorBarError;

  /**
   * `true` means that the upload is completed.
   * This is independent of the upload `progress`.
   */
  uploadComplete?: boolean;
}

/**
 * Strings of _AttachmentUploadCards that can be overridden.
 *
 * @internal
 */
export interface _AttachmentUploadCardsStrings {
  /** Aria label to notify user when focus is on cancel attachment upload button. */
  removeAttachment: string;
  /** Aria label to notify user attachment uploading starts. */
  uploading: string;
  /** Aria label to notify user attachment is uploaded. */
  uploadCompleted: string;
}

/**
 * @internal
 */
export interface FileUploadCardsProps {
  /**
   * Optional array of active attachment uploads where each object has attibutes
   * of a attachment upload like name, progress, errormessage etc.
   */
  activeFileUploads?: ActiveFileUpload[];
  /**
   * Optional callback to remove the attachment upload before sending by clicking on
   * cancel icon.
   */
  onCancelFileUpload?: (attachmentId: string) => void;
  /**
   * Optional arialabel strings for attachment upload cards
   */
  strings?: _AttachmentUploadCardsStrings;
}

const actionIconStyle = { height: '1rem' };

/**
 * @internal
 */
export const _AttachmentUploadCards = (props: FileUploadCardsProps): JSX.Element => {
  const attachments = props.activeFileUploads;
  const localeStrings = useLocaleAttachmentCardStringsTrampoline();
  const removeFileButtonString = useMemo(
    () => () => {
      return props.strings?.removeAttachment ?? localeStrings.removeAttachment;
    },
    [props.strings?.removeAttachment, localeStrings.removeAttachment]
  );

  if (!attachments || attachments.length === 0) {
    return <></>;
  }

  return (
    <_AttachmentCardGroup>
      {attachments &&
        attachments
          .filter((attachment) => !attachment.error)
          .map((attachment) => (
            <_AttachmentCard
              // temp converter before upload is refactored
              attachment={{
                id: attachment.id,
                name: attachment.filename,
                extension: extension(attachment.filename),
                progress: attachment.progress,
                uploadStatus: attachment.error
                  ? {
                      message: attachment.error?.message,
                      timestamp: attachment.error?.timestamp
                    }
                  : undefined
              }}
              progress={attachment.progress}
              key={attachment.id}
              menuActions={[
                {
                  name: props.strings?.removeAttachment ?? 'Remove',
                  icon: (
                    <div aria-label={removeFileButtonString()}>
                      <Icon iconName="CancelAttachmentUpload" style={actionIconStyle} />
                    </div>
                  ),
                  onClick: () => {
                    props.onCancelFileUpload && props.onCancelFileUpload(attachment.id);
                  }
                }
              ]}
              strings={props.strings}
            />
          ))}
    </_AttachmentCardGroup>
  );
};
