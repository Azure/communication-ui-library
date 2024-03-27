// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, TooltipHost } from '@fluentui/react';
import React from 'react';
import { useMemo } from 'react';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { useLocale } from '../localization';
import { _AttachmentCard } from './AttachmentCard';
import { _AttachmentCardGroup } from './AttachmentCardGroup';
import { _formatString } from '@internal/acs-ui-common';
import { AttachmentMenuAction, AttachmentMetadata } from '../types/Attachment';
import { ChatMessage } from '../types';

/**
 * Represents the type of attachment
 * @public
 */
export type ChatAttachmentType =
  | 'unknown'
  | 'image'
  | /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ 'file';

/**
 * @beta
 *
 * The default menu action for downloading attachments. This action will open the attachment's URL in a new tab.
 */
export const defaultAttachmentMenuAction: AttachmentMenuAction = {
  name: 'Download',
  icon: <Icon iconName="DownloadFile" />,
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
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
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
                menuActions={props.actionForAttachment?.(attachment, message) ?? getDefaultMenuActions(message)}
                onDownloadErrorMessage={props.onDownloadErrorMessage}
              />
            </TooltipHost>
          ))}
      </_AttachmentCardGroup>
    </div>
  );
};

const useLocaleStringsTrampoline = (): _AttachmentDownloadCardsStrings => {
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  return useLocale().strings.messageThread;
  return { downloadAttachment: '', attachmentCardGroupMessage: '' };
};

const getDefaultMenuActions = (chatMessage?: ChatMessage): AttachmentMenuAction[] => {
  // if message is sent by a Teams user, we need to use a different icon ("open")
  if (chatMessage?.senderId?.includes('9:orgid')) {
    return [
      {
        ...defaultAttachmentMenuAction,
        icon: <Icon iconName="OpenFile" />
      }
    ];
  }
  // otherwise, use the default icon ("download")
  return [defaultAttachmentMenuAction];
};
