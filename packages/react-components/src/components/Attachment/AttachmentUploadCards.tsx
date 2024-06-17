// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, mergeStyles } from '@fluentui/react';
import React, { useMemo } from 'react';
import { _AttachmentCard } from './AttachmentCard';
import { _AttachmentCardGroup, _AttachmentCardGroupLayout } from './AttachmentCardGroup';
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
import { useLocaleAttachmentCardStringsTrampoline } from '../utils/common';

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
  /** Aria label to notify user more attachment action menu. */
  attachmentMoreMenu: string;
}

/**
 * @internal
 */
export interface AttachmentUploadCardsProps {
  /**
   * Optional array of {@link AttachmentMetadataInProgress}
   */
  attachments?: AttachmentMetadataInProgress[];
  /**
   * Optional callback to remove the attachment upload before sending by clicking on
   * cancel icon.
   */
  onCancelAttachmentUpload?: (attachmentId: string) => void;
  /**
   * Optional arialabel strings for attachment upload cards
   */
  strings?: _AttachmentUploadCardsStrings;
  /**
   * Optional flag to disable attachment cards.
   */
  disabled?: boolean;
}

const actionIconStyle = { height: '1rem' };

/**
 * @internal
 */
export const _AttachmentUploadCards = (props: AttachmentUploadCardsProps): JSX.Element => {
  const attachments = props.attachments;
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
    <_AttachmentCardGroup attachmentGroupLayout={_AttachmentCardGroupLayout.Flex} disabled={props.disabled}>
      {attachments &&
        attachments
          .filter((attachment) => !attachment.error)
          .map((attachment) => (
            <_AttachmentCard
              attachment={attachment}
              key={attachment.id}
              menuActions={[
                {
                  name: removeAttachmentButtonString(),
                  icon: (
                    <div data-testid="attachment-upload-card-remove">
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
