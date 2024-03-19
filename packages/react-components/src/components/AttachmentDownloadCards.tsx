// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, IconButton, Spinner, SpinnerSize, TooltipHost } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import { useMemo } from 'react';
/* @conditional-compile-remove(file-sharing) */
import { useLocale } from '../localization';
import { _AttachmentCard } from './AttachmentCard';
import { _AttachmentCardGroup } from './AttachmentCardGroup';
import { iconButtonClassName } from './styles/IconButton.styles';
import { _formatString } from '@internal/acs-ui-common';

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * Represents the type of attachment
 * @public
 */
export type ChatAttachmentType =
  | 'unknown'
  | /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */ 'image'
  | /* @conditional-compile-remove(file-sharing) */ 'file';

/**
 * Metadata containing basic information about the uploaded attachment.
 *
 * @beta
 */
export interface AttachmentMetadata {
  /**
   * Extension hint, useful for rendering a specific icon.
   * An unknown or empty extension will be rendered as a generic icon.
   * Example: `pdf`
   */
  extension: string;
  /**
   * Unique ID of the attachment.
   */
  /* @conditional-compile-remove(file-sharing) */
  id: string;
  /**
   * File name to be displayed.
   */
  name: string;
  /**
   * Download URL for the attachment.
   */
  url: string;
  /* @conditional-compile-remove(file-sharing) */
  /*
   * Optional dictionary of meta data associated with the attachment.
   */
  payload?: Record<string, string>;
}

/**
 * Strings of _AttachmentDownloadCards that can be overridden.
 *
 * @internal
 */
export interface _AttachmentDownloadCardsStrings {
  /** Aria label to notify user when focus is on attachment download button. */
  downloadFile: string;
  fileCardGroupMessage: string;
}

/**
 * @beta
 * A attachment download error returned via a {@link FileDownloadHandler}.
 * This error message is used to render an error message in the UI.
 */
export interface FileDownloadError {
  /** The error message to display in the UI */
  errorMessage: string;
}

/**
 * @beta
 *
 * A callback function for handling attachment downloads.
 * The function needs to return a promise that resolves to a attachment download URL.
 * If the promise is rejected, the {@link Error.message} will be used to display an error message to the user.
 *
 * @example
 * ```ts
 * const attachmentDownloadHandler: FileDownloadHandler = async (userId, attachmentData) => {
 *   if (isUnauthorizedUser(userId)) {
 *     return { errorMessage: 'You don’t have permission to download this attachment.' };
 *   } else {
 *     return new URL(attachmentData.url);
 *   }
 * }
 *
 * const App = () => (
 *   <ChatComposite
 *     ...
 *     fileSharing={{
 *       fileDownloadHandler: fileDownloadHandler
 *     }}
 *   />
 * )
 *
 * ```
 * @param userId - The user ID of the user downloading the attachment.
 * @param fileMetadata - The {@link AttachmentMetadata} containing file `url`, `extension` and `name`.
 */
export type FileDownloadHandler = (
  userId: string,
  fileMetadata: AttachmentMetadata
) => Promise<URL | FileDownloadError>;

/**
 * @internal
 */
export interface _AttachmentDownloadCardsProps {
  /**
   * User id of the local participant
   */
  userId: string;
  /**
   * A chat message metadata that includes file metadata
   */
  fileMetadata?: AttachmentMetadata[];
  /**
   * A function of type {@link FileDownloadHandler} for handling attachment downloads.
   * If the function is not specified, the attachment's `url` will be opened in a new tab to
   * initiate the download.
   */
  downloadHandler?: FileDownloadHandler;
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
  const { userId, fileMetadata } = props;
  const [showSpinner, setShowSpinner] = useState(false);
  const localeStrings = useLocaleStringsTrampoline();

  const downloadFileButtonString = useMemo(
    () => () => {
      return props.strings?.downloadFile ?? localeStrings.downloadFile;
    },
    [props.strings?.downloadFile, localeStrings.downloadFile]
  );

  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  const isShowDownloadIcon = useCallback((attachment: AttachmentMetadata): boolean => {
    /* @conditional-compile-remove(file-sharing) */
    return attachment.payload?.teamsFileAttachment !== 'true';
    return true;
  }, []);

  const fileCardGroupDescription = useMemo(
    () => () => {
      const fileGroupLocaleString = props.strings?.fileCardGroupMessage ?? localeStrings.fileCardGroupMessage;
      /* @conditional-compile-remove(file-sharing) */
      return _formatString(fileGroupLocaleString, {
        fileCount: `${fileMetadata?.length ?? 0}`
      });
      return _formatString(fileGroupLocaleString, {
        fileCount: `${fileMetadata?.length ?? 0}`
      });
    },
    [props.strings?.fileCardGroupMessage, localeStrings.fileCardGroupMessage, fileMetadata]
  );

  const fileDownloadHandler = useCallback(
    async (userId: string, file: AttachmentMetadata) => {
      if (!props.downloadHandler) {
        window.open(file.url, '_blank', 'noopener,noreferrer');
      } else {
        setShowSpinner(true);
        try {
          const response = await props.downloadHandler(userId, file);
          setShowSpinner(false);
          if (response instanceof URL) {
            window.open(response.toString(), '_blank', 'noopener,noreferrer');
          } else {
            props.onDownloadErrorMessage && props.onDownloadErrorMessage(response.errorMessage);
          }
        } finally {
          setShowSpinner(false);
        }
      }
    },
    [props]
  );
  if (
    !fileMetadata ||
    fileMetadata.length === 0 ||
    /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */ !fileMetadata
  ) {
    return <></>;
  }

  return (
    <div style={attachmentDownloadCardsStyle} data-ui-id="file-download-card-group">
      <_AttachmentCardGroup ariaLabel={fileCardGroupDescription()}>
        {fileMetadata &&
          fileMetadata.map((attachment) => (
            <TooltipHost content={downloadFileButtonString()} key={attachment.name}>
              <_AttachmentCard
                attachmentName={attachment.name}
                key={attachment.name}
                attachmentExtension={attachment.extension}
                actionIcon={
                  showSpinner ? (
                    <Spinner size={SpinnerSize.medium} aria-live={'polite'} role={'status'} />
                  ) : true &&
                    /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */ isShowDownloadIcon(
                      attachment
                    ) ? (
                    <IconButton className={iconButtonClassName} ariaLabel={downloadFileButtonString()}>
                      <DownloadIconTrampoline />
                    </IconButton>
                  ) : undefined
                }
                actionHandler={() => fileDownloadHandler(userId, attachment)}
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
const DownloadIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(file-sharing)
  return <Icon data-ui-id="file-download-card-download-icon" iconName="DownloadFile" style={actionIconStyle} />;
  // Return _some_ available icon, as the real icon is beta-only.
  return <Icon iconName="EditBoxCancel" style={actionIconStyle} />;
};

const useLocaleStringsTrampoline = (): _AttachmentDownloadCardsStrings => {
  /* @conditional-compile-remove(file-sharing) */
  return useLocale().strings.messageThread;
  return { downloadFile: '', fileCardGroupMessage: '' };
};
