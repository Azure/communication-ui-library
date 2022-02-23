// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  Icon,
  IProgressIndicatorStyleProps,
  IProgressIndicatorStyles,
  IStyleFunctionOrObject,
  mergeStyles,
  ProgressIndicator,
  Stack,
  Text,
  useTheme
} from '@fluentui/react';
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
}

/**
 * @beta
 */
export const FileCard = (props: FileCardProps): JSX.Element => {
  const { fileName, fileExtension, progress, actionIcon } = props;
  const theme = useTheme();

  const showProgressIndicator = (): boolean => progress !== undefined && progress < 1;

  const containerClassName = mergeStyles({
    width: '14rem',
    background: theme.palette.neutralLighter,
    borderRadius: theme.effects.roundedCorner4,
    boxShadow: theme.effects.elevation8
  });

  const fileInfoWrapperClassName = mergeStyles({
    padding: '0.75rem',
    // To make space for the progress indicator.
    paddingBottom: showProgressIndicator() ? '0.5rem' : '0.75rem'
  });
  const fileInfoClassName = mergeStyles({
    paddingLeft: '0.25rem'
  });

  const actionIconClassName = mergeStyles({
    cursor: 'pointer',
    padding: '0.25rem'
  });

  const progressIndicatorStyles: IStyleFunctionOrObject<IProgressIndicatorStyleProps, IProgressIndicatorStyles> = {
    itemProgress: {
      // A hack to make the progress indicator match the design specs.
      height: 0,
      padding: '2px 0',
      // To make the progress indicator border curve along the bottom of file card.
      borderRadius: `0 0 ${theme.effects.roundedCorner4} ${theme.effects.roundedCorner4}`
    }
  };

  return (
    <Stack className={containerClassName}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={fileInfoWrapperClassName}>
        <Stack horizontal verticalAlign="center">
          <Stack>
            {/* We are not using <ChatCompositeIcon /> here as we currently do not support customizing these filetype icons. */}
            <Icon
              {...getFileTypeIconProps({
                extension: fileExtension,
                size: 24,
                imageFileType: 'svg'
              })}
            />
          </Stack>
          <Stack className={fileInfoClassName}>
            <Text>{fileName}</Text>
          </Stack>
        </Stack>
        <Stack
          className={actionIconClassName}
          onClick={() => {
            props.actionHandler && props.actionHandler();
          }}
        >
          {actionIcon && actionIcon}
        </Stack>
      </Stack>
      {showProgressIndicator() && <ProgressIndicator percentComplete={progress} styles={progressIndicatorStyles} />}
    </Stack>
  );
};
