// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, mergeStyles } from '@fluentui/react';
import React, { useMemo } from 'react';
import { _AttachmentCard } from './AttachmentCard';
import { _AttachmentCardGroup } from './AttachmentCardGroup';
import { AttachmentMetadata } from '../types/Attachment';
import { useLocaleAttachmentCardStringsTrampoline } from './utils/common';

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
export interface AttachmentUploadCardsProps {
  /**
   * Optional array of active attachment uploads where each object has attibutes
   * of a attachment upload like name, progress, errormessage etc.
   */
  activeAttachmentUploads?: AttachmentMetadata[];
  /**
   * Optional callback to remove the attachment upload before sending by clicking on
   * cancel icon.
   */
  onCancelAttachmentUpload?: (attachmentId: string) => void;
  /**
   * Optional arialabel strings for attachment upload cards
   */
  strings?: _AttachmentUploadCardsStrings;
}

const actionIconStyle = { height: '1rem' };

/**
 * @internal
 */
export const _AttachmentUploadCards = (props: AttachmentUploadCardsProps): JSX.Element => {
  const attachments = props.activeAttachmentUploads;
  const localeStrings = useLocaleAttachmentCardStringsTrampoline();
  const removeAttachmentButtonString = useMemo(
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
          .filter((attachment) => !attachment.uploadError)
          .map((attachment) => (
            <_AttachmentCard
              attachment={attachment}
              key={attachment.id}
              menuActions={[
                {
                  name: props.strings?.removeAttachment ?? 'Remove',
                  icon: (
                    <div aria-label={removeAttachmentButtonString()}>
                      <Icon iconName="CancelAttachmentUpload" className={mergeStyles(actionIconStyle)} />
                    </div>
                  ),
                  onClick: (attachment) => {
                    return new Promise((resolve, reject) => {
                      try {
                        props.onCancelAttachmentUpload && props.onCancelAttachmentUpload(attachment.id);
                        resolve();
                      } catch (e) {
                        reject((e as Error).message);
                      }
                    });
                  }
                }
              ]}
              strings={props.strings}
            />
          ))}
    </_AttachmentCardGroup>
  );
};
