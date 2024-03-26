// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { TooltipHost } from '@fluentui/react';
import React from 'react';
import { useMemo } from 'react';
/* @conditional-compile-remove(file-sharing) */
import { useLocale } from '../localization';
import { _AttachmentCard } from './AttachmentCard';
import { _AttachmentCardGroup } from './AttachmentCardGroup';
import { _formatString } from '@internal/acs-ui-common';
import { AttachmentMenuAction, AttachmentMetadata } from '../types/Attachment';
/* @conditional-compile-remove(file-sharing) */
import { ArrowDownload20Regular } from '@fluentui/react-icons';
import { ChatMessage } from '../types';

/**
 * Represents the type of attachment
 * @public
 */
export type ChatAttachmentType = 'unknown' | 'image' | /* @conditional-compile-remove(file-sharing) */ 'file';

/**
 * @beta
 * 
 * The default menu action for downloading attachments. This action will open the attachment's URL in a new tab.
 */
export const defaultAttachmentMenuAction: AttachmentMenuAction = {
  name: 'Download',
  icon: <ArrowDownload20Regular />,
  onClick: (attachment: AttachmentMetadata) => {
    window.open((attachment as AttachmentMetadata).url, '_blank', 'noopener,noreferrer');
  }
};

/**
 * Strings of _AttachmentDownloadCards that can be overridden.
 *
 * @internal
 */
export interface _AttachmentDownloadCardsStrings {
  /** Aria label to notify user when focus is on attachment download button. */
  downloadAttachment: string;
  attachmentCardGroupMessage: string;
}

/**
 * @internal
 */
export interface _AttachmentDownloadCardsProps {
  /**
   * A chat message metadata that includes file metadata
   */
  attachments?: AttachmentMetadata[];
  /**
   * A chat message metadata that includes file metadata
   */
  message?: ChatMessage;
  /**
   * Optional callback to handle file download
   */
  actionForAttachment?: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[];
  /**
   * Optional callback that runs if downloadHandler returns {@link FileDownloadError}.
   */
  onDownloadErrorMessage?: (errMsg: string) => void;
  /**
   * Optional aria label strings for attachment download cards
   */
  strings?: _AttachmentDownloadCardsStrings;
}

const attachmentDownloadCardsStyle = {
  marginTop: '0.25rem'
};

/**
 * @internal
 */
export const _AttachmentDownloadCards = (props: _AttachmentDownloadCardsProps): JSX.Element => {
  const { attachments, message } = props;
  const localeStrings = useLocaleStringsTrampoline();

  const downloadAttachmentButtonString = useMemo(
    () => () => {
      return props.strings?.downloadAttachment ?? localeStrings.downloadAttachment;
    },
    [props.strings?.downloadAttachment, localeStrings.downloadAttachment]
  );

  const attachmentCardGroupDescription = useMemo(
    () => () => {
      const fileGroupLocaleString =
        props.strings?.attachmentCardGroupMessage ?? localeStrings.attachmentCardGroupMessage;
      /* @conditional-compile-remove(file-sharing) */
      return _formatString(fileGroupLocaleString, {
        attachmentCount: `${attachments?.length ?? 0}`
      });
      return _formatString(fileGroupLocaleString, {
        attachmentCount: `${attachments?.length ?? 0}`
      });
    },
    [props.strings?.attachmentCardGroupMessage, localeStrings.attachmentCardGroupMessage, attachments]
  );

  if (!attachments || attachments.length === 0 || !attachments) {
    return <></>;
  }

  return (
    <div style={attachmentDownloadCardsStyle} data-ui-id="file-download-card-group">
      <_AttachmentCardGroup ariaLabel={attachmentCardGroupDescription()}>
        {attachments &&
          attachments.map((attachment) => (
            <TooltipHost content={downloadAttachmentButtonString()} key={attachment.name}>
              <_AttachmentCard
                attachment={attachment}
                key={attachment.id}
                menuActions={props.actionForAttachment?.(attachment, message) ?? [defaultAttachmentMenuAction]}
                onDownloadErrorMessage={props.onDownloadErrorMessage}
              />
            </TooltipHost>
          ))}
      </_AttachmentCardGroup>
    </div>
  );
};


const useLocaleStringsTrampoline = (): _AttachmentDownloadCardsStrings => {
  /* @conditional-compile-remove(file-sharing) */
  return useLocale().strings.messageThread;
  return { downloadAttachment: '', attachmentCardGroupMessage: '' };
};
