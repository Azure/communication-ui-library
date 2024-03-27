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
 * Strings of _AttachmentDownloadCards that can be overridden.
 *
 * @internal
 */
export interface _AttachmentDownloadCardsStrings {
  /** Aria label to notify user when focus is on attachment download button. */
  downloadAttachment: string;
  /** Aria label to notify user when focus is on attachment open button. */
  openAttachment: string;
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

const actionIconStyle = { height: '1rem' };

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
                menuActions={
                  props.actionForAttachment?.(attachment, message) ?? getDefaultMenuActions(localeStrings, message)
                }
                onDownloadErrorMessage={props.onDownloadErrorMessage}
              />
            </TooltipHost>
          ))}
      </_AttachmentCardGroup>
    </div>
  );
};

/**
 * @private
 */
const getDownloadIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload)
  <Icon iconName="DownloadFile" data-ui-id="file-download-card-download-icon" />;
  // Return _some_ available icon, as the real icon is beta-only.
  return <Icon iconName="EditBoxCancel" style={actionIconStyle} />;
};

/**
 * @private
 */
const useLocaleStringsTrampoline = (): _AttachmentDownloadCardsStrings => {
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  return useLocale().strings.messageThread;
  return { downloadAttachment: '', openAttachment: '', attachmentCardGroupMessage: '' };
};

/**
 * @private
 */
const getDefaultMenuActions = (
  locale: _AttachmentDownloadCardsStrings,
  chatMessage?: ChatMessage
): AttachmentMenuAction[] => {
  // if message is sent by a Teams user, we need to use a different icon ("open")
  if (chatMessage?.senderId?.includes('9:orgid')) {
    return [
      {
        ...defaultAttachmentMenuAction,
        name: locale.openAttachment,
        icon: <Icon iconName="OpenFile" />
      }
    ];
  }
  // otherwise, use the default icon ("download")
  return [
    {
      ...defaultAttachmentMenuAction,
      name: locale.downloadAttachment
    }
  ];
};

/**
 * @beta
 *
 * The default menu action for downloading attachments. This action will open the attachment's URL in a new tab.
 */
export const defaultAttachmentMenuAction: AttachmentMenuAction = {
  /**
   *
   * name is used for aria-label only when there's one button. For multiple buttons, it's used as a label.
   * by default it's an unlocalized string when this is used as a imported constant,
   * but you can overwrite it with your own localized string.
   *
   * i.e. defaultAttachmentMenuAction.name = localize('Download');
   *
   * when no action is provided, the UI library will overwrite this name
   * with a localized string this string when it's used in the UI.
   */
  name: 'Download',
  // this is the icon shown on the right of the file card
  icon: getDownloadIconTrampoline(),
  // this is the action that runs when the icon is clicked
  onClick: (attachment: AttachmentMetadata) => {
    window.open((attachment as AttachmentMetadata).url, '_blank', 'noopener,noreferrer');
  }
};
