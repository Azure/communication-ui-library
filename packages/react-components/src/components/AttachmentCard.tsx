// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  // eslint-disable-next-line no-restricted-imports
  Icon
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
import { useEffect, useState, useMemo } from 'react';
import { _AttachmentUploadCardsStrings } from './AttachmentUploadCards';
import { useLocaleAttachmentCardStringsTrampoline } from './utils/common';
import { AttachmentMetadata, AttachmentMenuAction } from '../types/Attachment';
import { MoreHorizontal24Filled } from '@fluentui/react-icons';
import { useAttachmentCardStyles, fileNameContainerClassName } from './styles/AttachmentCard.styles';

/**
 * @internal
 * AttachmentCard Component Props.
 */
export interface _AttachmentCardProps {
  /**
   * Attachment details including name, extension, url, etc.
   */
  attachment: AttachmentMetadata;
  /**
   * Optional property to indicate progress of file upload.
   */
  progress?: number;
  /**
   * An array of menu actions to be displayed in the attachment card.
   */
  menuActions: AttachmentMenuAction[];
  /**
   * Optional arialabel strings for file cards
   */
  strings?: _AttachmentUploadCardsStrings;
  /**
   * Optional callback that runs if menu bar action onclick throws.
   */
  onActionHandlerFailed?: (errMsg: string) => void;
}

/**
 * @internal
 * A component for displaying an attachment card with attachment icon and progress bar.
 *
 * `_AttachmentCard` internally uses the `Card` component from `@fluentui/react-components`. You can checkout the details about these components [here](https://react.fluentui.dev/?path=/docs/components-card).
 */
export const _AttachmentCard = (props: _AttachmentCardProps): JSX.Element => {
  const { attachment, progress, menuActions, onActionHandlerFailed } = props;
  const attachmentCardStyles = useAttachmentCardStyles();

  const isUploadComplete = useMemo(() => {
    return progress !== undefined && progress > 0 && progress < 1;
  }, [progress]);

  const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);
  const localeStrings = useLocaleAttachmentCardStringsTrampoline();
  const uploadStartedString = props.strings?.uploading ?? localeStrings.uploading;
  const uploadCompletedString = props.strings?.uploadCompleted ?? localeStrings.uploadCompleted;

  const showProgressIndicator = progress !== undefined && progress > 0 && progress < 1;

  useEffect(() => {
    if (showProgressIndicator) {
      setAnnouncerString(`${uploadStartedString} ${attachment.name}`);
    } else if (progress === 1) {
      setAnnouncerString(`${attachment.name} ${uploadCompletedString}`);
    } else {
      setAnnouncerString(undefined);
    }
  }, [progress, showProgressIndicator, attachment.name, uploadStartedString, uploadCompletedString]);

  return (
    <div data-is-focusable={true}>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      <Card className={attachmentCardStyles.root} size="small" role="listitem">
        <CardHeader
          image={
            <Icon
              data-ui-id={'filetype-icon'}
              iconName={
                getFileTypeIconProps({
                  extension: useMemo((): string => {
                    return attachment.extension ?? attachment.name.split('.').pop() ?? '';
                  }, [attachment]),
                  size: 24,
                  imageFileType: 'svg'
                }).iconName
              }
            />
          }
          header={
            <div className={fileNameContainerClassName}>
              <Text title={attachment.name}>{attachment.name}</Text>
            </div>
          }
          action={getMenuItems(menuActions, attachment, onActionHandlerFailed)}
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
  handleOnClickError?: (errMsg: string) => void
): JSX.Element => {
  if (menuActions.length === 0) {
    return <></>;
  }
  return menuActions.length === 1 ? (
    <ToolbarButton
      aria-label={menuActions[0].name}
      icon={menuActions[0].icon}
      onClick={() => {
        try {
          menuActions[0].onClick(attachment);
        } catch (e) {
          handleOnClickError?.((e as Error).message);
        }
      }}
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
                onClick={async () => {
                  try {
                    await menuItem.onClick(attachment);
                  } catch (e) {
                    handleOnClickError?.((e as Error).message);
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
