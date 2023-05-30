// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  // eslint-disable-next-line no-restricted-imports
  Icon,
  IProgressIndicatorStyleProps,
  IProgressIndicatorStyles,
  IStyleFunctionOrObject,
  mergeStyles,
  ProgressIndicator,
  Stack,
  Text,
  useTheme,
  registerIcons,
  getIcon
} from '@fluentui/react';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import React from 'react';
import { _pxToRem } from '@internal/acs-ui-common';
import { Announcer } from './Announcer';
import { useEffect, useState } from 'react';
import { _FileUploadCardsStrings } from './FileUploadCards';
import { useLocaleFileCardStringsTrampoline } from './utils/common';

/**
 * @internal
 * _FileCard Component Props.
 */
export interface _FileCardProps {
  /**
   * File name.
   */
  fileName: string;
  /**
   * Extension of the file used for rendering the file icon.
   */
  fileExtension: string;
  /**
   * File upload progress percentage between 0 and 1.
   * File transfer progress indicator is only shown when the value is greater than 0 and less than 1.
   */
  progress?: number;
  /**
   * Icon to display for actions like download, upload, etc. along the file name.
   */
  actionIcon?: JSX.Element;
  /**
   * Function that runs when actionIcon is clicked
   */
  actionHandler?: () => void;
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
  const { fileName, fileExtension, progress, actionIcon } = props;
  const theme = useTheme();
  const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);
  const localeStrings = useLocaleFileCardStringsTrampoline();
  const uploadStartedString = props.strings?.uploading ?? localeStrings.uploading;
  const uploadCompletedString = props.strings?.uploadCompleted ?? localeStrings.uploadCompleted;

  const showProgressIndicator = progress !== undefined && progress > 0 && progress < 1;

  useEffect(() => {
    if (showProgressIndicator) {
      setAnnouncerString(`${uploadStartedString} ${fileName}`);
    } else if (progress === 1) {
      setAnnouncerString(`${fileName} ${uploadCompletedString}`);
    } else {
      setAnnouncerString(undefined);
    }
  }, [progress, showProgressIndicator, fileName, uploadStartedString, uploadCompletedString]);

  const progressBarThicknessPx = 4;

  const containerClassName = mergeStyles({
    width: '12rem',
    background: theme.palette.neutralLighter,
    borderRadius: theme.effects.roundedCorner4,
    border: `${_pxToRem(1)} solid ${theme.palette.neutralQuaternary}`,
    cursor: 'pointer'
  });

  const fileInfoWrapperClassName = mergeStyles({
    padding: _pxToRem(12),
    // To make space for the progress indicator.
    paddingBottom: showProgressIndicator ? _pxToRem(12 - progressBarThicknessPx * 2) : _pxToRem(12)
  });

  const fileNameContainerClassName = mergeStyles({
    paddingLeft: _pxToRem(4),
    minWidth: '75%',
    maxWidth: '75%'
  });

  const fileNameTextClassName = mergeStyles({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
    paddingRight: _pxToRem(4)
  });

  const actionIconClassName = mergeStyles({
    cursor: 'pointer'
  });

  const progressIndicatorStyles: IStyleFunctionOrObject<IProgressIndicatorStyleProps, IProgressIndicatorStyles> = {
    itemProgress: {
      padding: `${_pxToRem(progressBarThicknessPx - 1)} 0`, // item progress height won't apply without an explicit padding
      // To make the progress indicator border curve along the bottom of file card.
      borderRadius: `0 0 ${theme.effects.roundedCorner4} ${theme.effects.roundedCorner4}`
    },
    progressBar: {
      height: _pxToRem(progressBarThicknessPx)
    }
  };

  const iconNameProps: {
    iconName: string;
    'aria-label'?: string | undefined;
  } = getFileTypeIconProps({
    extension: fileExtension,
    size: 24,
    imageFileType: 'svg'
  });

  const icon = <Icon data-ui-id={'filetype-icon'} {...iconNameProps} />;
  if (getIcon(iconNameProps.iconName) === undefined) {
    registerIcons({ icons: { [iconNameProps.iconName]: icon } });
  }

  return (
    <div data-is-focusable={true}>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      <Stack
        className={containerClassName}
        onClick={() => {
          props.actionHandler?.();
        }}
      >
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={fileInfoWrapperClassName}>
          <Stack>
            {/* We are not using <ChatCompositeIcon /> here as we currently do not support customizing these filetype icons. */}
            {icon}
          </Stack>
          <Stack className={fileNameContainerClassName}>
            <Text className={fileNameTextClassName}>{fileName}</Text>
          </Stack>
          <Stack verticalAlign="center" className={actionIconClassName}>
            {actionIcon && actionIcon}
          </Stack>
        </Stack>
        {showProgressIndicator && <ProgressIndicator percentComplete={progress} styles={progressIndicatorStyles} />}
      </Stack>
    </div>
  );
};
