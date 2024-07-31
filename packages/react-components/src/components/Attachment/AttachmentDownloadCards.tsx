// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon } from '@fluentui/react';
import React, { useCallback } from 'react';
import { useMemo } from 'react';
/* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
import { useLocale } from '../../localization';
import { _AttachmentCard } from './AttachmentCard';
import { _AttachmentCardGroup, _AttachmentCardGroupLayout } from './AttachmentCardGroup';
import { _formatString, _isIdentityMicrosoftTeamsUser } from '@internal/acs-ui-common';
import { AttachmentMenuAction } from '../../types/Attachment';
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { ChatMessage } from '../../types';
import { mergeClasses } from '@griffel/react';
import { _ATTACHMENT_CARD_WIDTH_IN_REM } from '../styles/AttachmentCard.styles';
import { useAttachmentCardGroupStyles } from '../styles/AttachmentCardGroup.styles';

/**
 * Represents the type of attachment
 * @public
 */
export type ChatAttachmentType =
  | 'unknown'
  | 'image'
  | /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */ 'file';

/**
 * Strings of _AttachmentDownloadCards that can be overridden.
 *
 * @internal
 */
export interface _AttachmentDownloadCardsStrings {
  /* @conditional-compile-remove(file-sharing-acs) */
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
   * A chat message metadata that includes attachment metadata
   */
  attachments?: AttachmentMetadata[];
  /**
   * A chat message metadata that includes attachment metadata
   */
  message?: ChatMessage;
  /**
   * Optional callback to handle attachment download
   */
  actionsForAttachment?: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[];
  /**
   * Optional callback that runs if downloadHandler returns an error.
   */
  onActionHandlerFailed?: (errMsg: string) => void;
  /**
   * Optional aria label strings for attachment download cards
   */
  strings?: _AttachmentDownloadCardsStrings;
}

/**
 * @internal
 */
export const _AttachmentDownloadCards = (props: _AttachmentDownloadCardsProps): JSX.Element => {
  const { attachments, message } = props;
  const localeStrings = useLocaleStringsTrampoline();
  const attachmentCardGroupStyles = useAttachmentCardGroupStyles();

  const getMenuActions = useCallback(
    (
      attachment: AttachmentMetadata,
      localeStrings: _AttachmentDownloadCardsStrings,
      message?: ChatMessage,
      action?: (attachment: AttachmentMetadata, message?: ChatMessage) => AttachmentMenuAction[]
    ): AttachmentMenuAction[] => {
      const defaultMenuActions = getDefaultMenuActions(localeStrings, message);
      try {
        const actions = action?.(attachment, message);
        if (actions && actions.length > 0) {
          return actions;
        } else {
          return defaultMenuActions;
        }
      } catch (error) {
        return defaultMenuActions;
      }
    },
    []
  );

  const hasMultipleAttachments = useMemo(() => {
    return (props.attachments?.length ?? 0) > 1;
  }, [props.attachments]);

  if (!attachments || attachments.length === 0 || !attachments) {
    return <></>;
  }

  return (
    <div
      className={mergeClasses(
        attachmentCardGroupStyles.root,
        hasMultipleAttachments
          ? attachmentCardGroupStyles.multipleAttachments
          : attachmentCardGroupStyles.singleAttachment
      )}
      data-ui-id="attachment-download-card-group"
    >
      <_AttachmentCardGroup attachmentGroupLayout={_AttachmentCardGroupLayout.Grid}>
        {attachments &&
          attachments.map((attachment) => (
            <_AttachmentCard
              attachment={attachment}
              key={attachment.id}
              menuActions={getMenuActions(attachment, localeStrings, message, props.actionsForAttachment)}
              onActionHandlerFailed={props.onActionHandlerFailed}
              selfResizing={hasMultipleAttachments}
            />
          ))}
      </_AttachmentCardGroup>
    </div>
  );
};

/**
 * @private
 */
const useLocaleStringsTrampoline = (): _AttachmentDownloadCardsStrings => {
  /* @conditional-compile-remove(file-sharing-teams-interop) @conditional-compile-remove(file-sharing-acs) */
  return useLocale().strings.messageThread;
  return {
    /* @conditional-compile-remove(file-sharing-acs) */
    downloadAttachment: '',
    openAttachment: '',
    attachmentCardGroupMessage: ''
  };
};

/**
 * @private
 */
const getDefaultMenuActions = (
  locale: _AttachmentDownloadCardsStrings,
  chatMessage?: ChatMessage
): AttachmentMenuAction[] => {
  let actionName = locale.openAttachment;
  // if message is sent by a Teams user, we need to use a different icon ("open")
  const isTeamsUser = _isIdentityMicrosoftTeamsUser(chatMessage?.senderId);
  if (isTeamsUser) {
    return [
      {
        name: actionName,
        icon: <Icon iconName="OpenAttachment" />,
        onClick: defaultOnClickHandler
      }
    ];
  }
  // otherwise, use the default icon ("download")
  /* @conditional-compile-remove(file-sharing-acs) */
  actionName = locale.downloadAttachment;
  return [
    {
      ...defaultAttachmentMenuAction,
      name: actionName
    }
  ];
};

/**
 *
 * The default action handler for downloading attachments. This handler will open the attachment's URL in a new tab.
 */
const defaultOnClickHandler = (attachment: AttachmentMetadata): Promise<void> => {
  return new Promise<void>((resolve) => {
    window.open((attachment as AttachmentMetadata).url, '_blank', 'noopener,noreferrer');
    resolve();
  });
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
  // this is the icon shown on the right of the attachment card
  icon: <Icon iconName="DownloadAttachment" data-ui-id="attachment-download-card-download-icon" />,
  // this is the action that runs when the icon is clicked
  onClick: defaultOnClickHandler
};
