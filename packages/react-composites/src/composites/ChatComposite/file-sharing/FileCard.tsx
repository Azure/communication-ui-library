// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Icon, mergeStyles, ProgressIndicator, Stack, Text, useTheme } from '@fluentui/react';
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import React from 'react';

/**
 * @beta
 */
export interface FileCardProps {
  /**
   * File name.
   */
  fileName: string;
  /**
   * Extension of the file used for rendering the file icon.
   */
  fileExtension: string;
  /**
   * File upload/download progress percentage between 0 and 1.
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
}

/**
 * @beta
 */
export const FileCard = (props: FileCardProps): JSX.Element => {
  const { fileName, fileExtension, progress, actionIcon } = props;
  const theme = useTheme();

  return (
    <Stack
      className={mergeStyles({
        width: '14rem',
        background: theme.palette.neutralLighter,
        borderRadius: theme.effects.roundedCorner4,
        boxShadow: theme.effects.elevation8
      })}
    >
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        className={mergeStyles({
          padding: progress === undefined ? '0.75rem' : '0.75rem 0.75rem 0.5rem 0.75rem'
        })}
      >
        <Stack>
          <Icon
            {...getFileTypeIconProps({
              extension: fileExtension,
              size: 24,
              imageFileType: 'svg'
            })}
          />
        </Stack>
        <Stack horizontalAlign="start">
          <Text>{fileName}</Text>
        </Stack>
        <Stack
          style={{ cursor: 'pointer', padding: '0.25rem' }}
          onClick={() => {
            props.actionHandler && props.actionHandler();
          }}
        >
          {actionIcon && actionIcon}
        </Stack>
      </Stack>
      {progress !== undefined && progress < 1 && (
        <ProgressIndicator
          percentComplete={progress}
          styles={{
            itemProgress: {
              height: 0,
              padding: '2px 0',
              borderRadius: '0 0 4px 4px'
            }
          }}
        />
      )}
    </Stack>
  );
};
