// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Icon, mergeStyles, ProgressIndicator, Stack } from '@fluentui/react';
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
   * Extensdion of the file used for rendering the file icon.
   */
  fileExtension: string;
  /**
   * If true, features like upload progress and cancel button will not be shown.
   * Default value is false;
   */
  downloadable?: boolean;
  /**
   * File upload/download progress percentage between 0 and 1.
   * Not shown if undefined.
   */
  progress?: number;
}

/**
 * @beta
 */
export const FileCard = (props: FileCardProps): JSX.Element => {
  const { fileName, fileExtension, downloadable, progress } = props;

  const progressIndicator = (): JSX.Element => (
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
  );

  return (
    <Stack
      className={mergeStyles({
        width: '14rem',
        background: '#F3F2F1',
        borderRadius: '4px',
        boxShadow: '0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)'
      })}
    >
      <Stack
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center"
        className={mergeStyles({
          padding: progress === undefined ? '12px' : '12px 12px 8px 12px'
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
        <Stack
          className={mergeStyles({
            fontSize: '14px',
            fontWeight: '500'
          })}
        >
          {fileName}
        </Stack>
        <Stack style={{ cursor: 'pointer', padding: '0.25rem' }}>
          {downloadable ? (
            <Icon iconName="Download" style={{ fontSize: '16px' }} />
          ) : (
            <Icon iconName="ChromeClose" style={{ fontSize: '12px' }} />
          )}
        </Stack>
      </Stack>
      {progress !== undefined && progressIndicator()}
    </Stack>
  );
};
