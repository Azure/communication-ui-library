// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  Icon //,
  /*IProgressIndicatorStyleProps,
  IProgressIndicatorStyles,
  IStyleFunctionOrObject,
  mergeStyles,
  ProgressIndicator,
  Stack,*/
  //useTheme
} from '@fluentui/react';
import {
  Caption1,
  Card,
  CardHeader,
  // Button,
  Text,
  Menu,
  MenuTrigger,
  ToolbarButton,
  MenuPopover,
  MenuItem,
  MenuList,
  Toolbar,
  CardFooter,
  ProgressBar //,
  // Field
} from '@fluentui/react-components';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import React from 'react';
import { _pxToRem } from '@internal/acs-ui-common';
// import { useEffect, useState } from 'react';
import { _FileUploadCardsStrings } from './FileUploadCards';
// import { useLocaleFileCardStringsTrampoline } from './utils/common';
import {
  // ArrowDownload16Filled,
  // MoreHorizontal20Regular,
  MoreHorizontal24Filled //,
  // Pin24Regular,
  // ShareRegular,
  // WindowNew24Regular
} from '@fluentui/react-icons';
import { AttachmentMetadata, FileCardMenuAction } from './FileDownloadCards';

/**
 * @internal
 * _FileCard Component Props.
 */
export interface _FileCardProps {
  /**
   * File.
   */
  file: AttachmentMetadata;

  progress?: number;

  menuActions: FileCardMenuAction[];
  /**
   * Optional arialabel strings for file cards
   */
  strings?: _FileUploadCardsStrings;
}

/**
 * @internal
 * A component for displaying a file card with file icon and progress bar.
 */
export const _FileCard = (props: _FileCardProps): JSX.Element => {
  const { file, progress, menuActions } = props;
  // const theme = useTheme();
  // const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);
  // const localeStrings = useLocaleFileCardStringsTrampoline();
  // const uploadStartedString = props.strings?.uploading ?? localeStrings.uploading;
  // const uploadCompletedString = props.strings?.uploadCompleted ?? localeStrings.uploadCompleted;

  // const showProgressIndicator = progress !== undefined && progress > 0 && progress < 1;

  /*useEffect(() => {
    if (showProgressIndicator) {
      setAnnouncerString(`${uploadStartedString} ${fileName}`);
    } else if (progress === 1) {
      setAnnouncerString(`${fileName} ${uploadCompletedString}`);
    } else {
      setAnnouncerString(undefined);
    }
  }, [progress, showProgressIndicator, fileName, uploadStartedString, uploadCompletedString]);
  */
  // const progressBarThicknessPx = 4;

  const isUpload = progress !== undefined && progress > 0 && progress < 1;
  const fileName = file.name;
  const fileExtension = file.extension && file.extension !== '' ? file.extension : file.name.split('.').pop();
  const subTitle = file.url?.toLowerCase().includes('sharepoint') ? 'SharePoint > Chat' : undefined;
  return (
    <div>
      <Card size="small" role="listitem">
        <CardHeader
          image={
            <Icon
              data-ui-id={'filetype-icon'}
              iconName={
                getFileTypeIconProps({
                  extension: fileExtension,
                  size: 24,
                  imageFileType: 'svg'
                }).iconName
              }
            />
          }
          header={
            <Text weight="semibold" style={{ marginTop: '5px' }}>
              {fileName}
            </Text>
          }
          description={subTitle ? <Caption1>SharePoint &gt; Chat</Caption1> : <></>}
          action={getMenuItems(menuActions, file)}
        />
      </Card>
      {isUpload ? (
        <CardFooter>
          <ProgressBar thickness="medium" value={progress} shape="rounded" />
        </CardFooter>
      ) : (
        <> </>
      )}
    </div>
  );
};

const getMenuItems = (menuActions: FileCardMenuAction[], attachment: AttachmentMetadata): JSX.Element => {
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
              <MenuItem key={index} icon={menuItem.icon} onClick={() => menuItem.onClick(attachment)}>
                {menuItem.name}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </Toolbar>
  );
};
