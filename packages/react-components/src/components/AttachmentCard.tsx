// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  // eslint-disable-next-line no-restricted-imports
  Icon,
  mergeStyles
} from '@fluentui/react';
import {
  Card,
  CardHeader,
  Text,
  Menu,
  MenuTrigger,
  ToolbarButton,
  MenuPopover,
  MenuItem,
  MenuList,
  Toolbar,
  CardFooter,
  ProgressBar
} from '@fluentui/react-components';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import React from 'react';
import { _pxToRem } from '@internal/acs-ui-common';
import { Announcer } from './Announcer';
import { useEffect, useState } from 'react';
import { _AttachmentUploadCardsStrings } from './AttachmentUploadCards';
import { useLocaleAttachmentCardStringsTrampoline } from './utils/common';
import { AttachmentMetadata, AttachmentMenuAction } from './AttachmentDownloadCards';
import { MoreHorizontal24Filled } from '@fluentui/react-icons';

/**
 * @internal
 * _AttachmentCard Component Props.
 */
export interface _AttachmentCardProps {
  /**
   * Attachment name.
   */
  attachmentName: string;
  /**
   * Extension of the attachment used for rendering the attachment icon.
   */
  attachmentExtension: string;
  /**
   * Attachment upload progress percentage between 0 and 1.
   * Attachment transfer progress indicator is only shown when the value is greater than 0 and less than 1.
   */
  progress?: number;
  /**
   * Icon to display for actions like download, upload, etc. along the attachment name.
   */
  actionIcon?: JSX.Element;
  /**
   * Function that runs when actionIcon is clicked
   */
  actionHandler?: () => void;
  /**
   * Optional arialabel strings for attachment cards
   */
  strings?: _AttachmentUploadCardsStrings;
}

/**
 * @internal
 * A component for displaying an attachment card with attachment icon and progress bar.
 */
export const _AttachmentCard = (props: _AttachmentCardProps): JSX.Element => {
  const { attachmentName, attachmentExtension, progress, actionIcon, actionHandler } = props;
  // const { file, progress, menuActions, onDownloadErrorMessage } = props;
  // const fileName = attachmentName;
  // const fileExtension = file.extension && file.extension !== '' ? file.extension : file.name.split('.').pop();

  // default/placeholder before actual code implemented
  const menuActions: AttachmentMenuAction[] = [
    {
      name: actionIcon && actionIcon?.props.ariaLabel,
      icon: actionIcon ?? <></>,
      onClick: (attachment: AttachmentMetadata) => {
        if (attachment) {
          actionHandler?.();
        }
        // window.open((attachment as AttachmentMetadata).url, '_blank', 'noopener,noreferrer');
      }
    }
  ];

  // placeholder before refactoring the props
  const attachment: AttachmentMetadata = {
    /* @conditional-compile-remove(file-sharing) */
    id: 'attachmentId',
    extension: attachmentExtension,
    name: attachmentName,
    url: 'https://localhost' // placeholder not used
  };

  // placeholder before refactoring the props
  const onDownloadErrorMessage = (errorMessage: string): void => {
    console.log(errorMessage);
  };

  const isUploadComplete = progress !== undefined && progress > 0 && progress < 1;

  const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);
  const localeStrings = useLocaleAttachmentCardStringsTrampoline();
  const uploadStartedString = props.strings?.uploading ?? localeStrings.uploading;
  const uploadCompletedString = props.strings?.uploadCompleted ?? localeStrings.uploadCompleted;

  const showProgressIndicator = progress !== undefined && progress > 0 && progress < 1;

  useEffect(() => {
    if (showProgressIndicator) {
      setAnnouncerString(`${uploadStartedString} ${attachmentName}`);
    } else if (progress === 1) {
      setAnnouncerString(`${attachmentName} ${uploadCompletedString}`);
    } else {
      setAnnouncerString(undefined);
    }
  }, [progress, showProgressIndicator, attachmentName, uploadStartedString, uploadCompletedString]);

  const containerClassName = mergeStyles({
    width: '12rem',
    minWidth: '75%'
  });

  const fileNameContainerClassName = mergeStyles({
    marginTop: _pxToRem(5),
    width: '5.75rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    span: {
      whiteSpace: 'nowrap'
    }
  });

  return (
    <div data-is-focusable={true}>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      <Card className={containerClassName} size="small" role="listitem">
        <CardHeader
          image={
            <Icon
              data-ui-id={'filetype-icon'}
              iconName={
                getFileTypeIconProps({
                  extension: attachmentExtension,
                  size: 24,
                  imageFileType: 'svg'
                }).iconName
              }
            />
          }
          header={
            <div className={fileNameContainerClassName}>
              <Text title={attachmentName}>{attachmentName}</Text>
            </div>
          }
          action={getMenuItems(menuActions, attachment, onDownloadErrorMessage)}
        />
      </Card>
      {isUploadComplete ? (
        <CardFooter>
          <ProgressBar thickness="medium" value={progress} shape="rounded" />
        </CardFooter>
      ) : (
        <> </>
      )}
    </div>
  );
};

const getMenuItems = (
  menuActions: AttachmentMenuAction[],
  attachment: AttachmentMetadata,
  onDownloadErrorMessage?: (errMsg: string) => void
): JSX.Element => {
  return menuActions.length === 1 ? (
    <ToolbarButton
      aria-label={menuActions[0].name}
      icon={menuActions[0].icon}
      onClick={() => menuActions[0].onClick(attachment)}
    />
  ) : (
    <Toolbar>
      <Menu>
        <MenuTrigger>
          <ToolbarButton aria-label="More" icon={<MoreHorizontal24Filled />} />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {menuActions.map((menuItem, index) => (
              <MenuItem
                key={index}
                icon={menuItem.icon}
                onClick={() => {
                  try {
                    menuItem.onClick(attachment);
                  } catch (e) {
                    console.error(e);
                    onDownloadErrorMessage?.((e as Error).message);
                  }
                }}
              >
                {menuItem.name}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </Toolbar>
  );
};
