// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// import { Icon /*, IconButton, Spinner, SpinnerSize , TooltipHost*/ } from '@fluentui/react';
import React /*, {  useCallback , useState  }*/ from 'react';
import { useMemo } from 'react';
/* @conditional-compile-remove(file-sharing) */
import { useLocale } from '../localization';
import { _AttachmentCard } from './AttachmentCard';
import { _AttachmentCardGroup } from './AttachmentCardGroup';
// import { iconButtonClassName } from './styles/IconButton.styles';
import { _formatString } from '@internal/acs-ui-common';
import { ArrowDownload24Filled /*, Open24Filled, Open24Regular*/ } from '@fluentui/react-icons';
import { SendBoxErrorBarError } from './SendBoxErrorBar';

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
 * Metadata containing basic information about the uploaded file.
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
   * Unique ID of the file.
   */
  id: string;
  /**
   * File name to be displayed.
   */
  name: string;
  /**
   * Download URL for the file.
   */
  url?: string;
  /* @conditional-compile-remove(file-sharing) */
  /*
   * Optional dictionary of meta data associated with the file.
   */
  payload?: Record<string, string>;

  /**
   * A number between 0 and 1 indicating the progress of the upload.
   * This is unrelated to the `uploadComplete` property.
   * It is only used to show the progress of the upload.
   * Progress of 1 doesn't mark the upload as complete, set the `uploadComplete`
   * property to true to mark the upload as complete.
   */
  progress?: number;

  /**
   * Error to be displayed to the user if the upload fails.
   */
  error?: SendBoxErrorBarError;
}

/**
 * Strings of _AttachmentDownloadCards that can be overridden.
 *
 * @internal
 */
export interface _AttachmentDownloadCardsStrings {
  /** Aria label to notify user when focus is on file download button. */
  downloadFile: string;
  fileCardGroupMessage: string;
}

/**
 * @beta
 */
export interface AttachmentDownloadOptions {
  menuActions: AttachmentMenuAction[];
}

/**
 * @beta
 */
export interface AttachmentMenuAction {
  name: string;
  icon: JSX.Element;
  onClick: (attachment: AttachmentMetadata) => void;
}

/**
 * @beta
 */
export const defaultAttachmentMenuAction: AttachmentMenuAction = {
  name: 'Open',
  icon: <ArrowDownload24Filled />,
  onClick: (attachment: AttachmentMetadata) => {
    window.open((attachment as AttachmentMetadata).url, '_blank', 'noopener,noreferrer');
  }
};

/**
 * @internal
 */
export interface _AttachmentDownloadCardsProps {
  /**
   * A chat message metadata that includes file metadata
   */
  attachment?: AttachmentMetadata[];
  /**
   * Optional callback to handle file download
   */
  menuActions?: AttachmentMenuAction[];
  /**
   * Optional callback that runs if downloadHandler returns {@link AttachmentDownloadError}.
   */
  onDownloadErrorMessage?: (errMsg: string) => void;
  /**
   * Optional aria label strings for file download cards
   */
  strings?: _AttachmentDownloadCardsStrings;
}

/*const attachmentDownloadCardsStyle = {
  marginTop: '0.25rem'
};*/

// const actionIconStyle = { height: '1rem' };

/**
 * @internal
 */
export const _AttachmentDownloadCards = (props: _AttachmentDownloadCardsProps): JSX.Element => {
  const { attachment } = props;
  // const [showSpinner, setShowSpinner] = useState(false);
  const localeStrings = useLocaleStringsTrampoline();

  /*
  const downloadFileButtonString = useMemo(
    () => () => {
      return props.strings?.downloadFile ?? localeStrings.downloadFile;
    },
    [props.strings?.downloadFile, localeStrings.downloadFile]
  );*/

  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */

  // const isShowDownloadIcon = useCallback((attachment: AttachmentMetadata): boolean => {
  /* @conditional-compile-remove(file-sharing) */
  //   return attachment.payload?.teamsFileAttachment !== 'true';
  //   return true;
  // }, []);

  const fileCardGroupDescription = useMemo(
    () => () => {
      const fileGroupLocaleString = props.strings?.fileCardGroupMessage ?? localeStrings.fileCardGroupMessage;
      /* @conditional-compile-remove(file-sharing) */
      return _formatString(fileGroupLocaleString, {
        fileCount: `${attachment?.length ?? 0}`
      });
      return _formatString(fileGroupLocaleString, {
        fileCount: `${attachment?.length ?? 0}`
      });
    },
    [props.strings?.fileCardGroupMessage, localeStrings.fileCardGroupMessage, attachment]
  );

  if (
    !attachment ||
    attachment.length === 0 ||
    /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */ !attachment
  ) {
    return <></>;
  }

  return (
    <div data-ui-id="file-download-card-group">
      <_AttachmentCardGroup ariaLabel={fileCardGroupDescription()}>
        {attachment &&
          attachment
            .filter((attachment) => {
              /* @conditional-compile-remove(file-sharing) */
              return attachment.payload?.teamsFileAttachment !== 'true';
              return true;
            })
            .map((file) => file as unknown as AttachmentMetadata)
            .map((file) => (
              <_AttachmentCard
                file={file}
                key={file.id}
                menuActions={props.menuActions ?? [defaultAttachmentMenuAction]}
                onDownloadErrorMessage={props.onDownloadErrorMessage}
              />
            ))}
      </_AttachmentCardGroup>
    </div>
  );
};

const useLocaleStringsTrampoline = (): _AttachmentDownloadCardsStrings => {
  /* @conditional-compile-remove(file-sharing) */
  return useLocale().strings.messageThread;
  return { downloadFile: '', fileCardGroupMessage: '' };
};

/*
const DownloadIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(file-sharing)
  return <Icon data-ui-id="file-download-card-download-icon" iconName="DownloadFile" style={actionIconStyle} />;
  // Return _some_ available icon, as the real icon is beta-only.
  return <Icon iconName="EditBoxCancel" style={actionIconStyle} />;
};
*/
