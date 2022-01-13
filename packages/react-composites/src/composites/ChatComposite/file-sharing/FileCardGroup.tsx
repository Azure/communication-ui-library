// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { mergeStyles, Stack } from '@fluentui/react';
import React from 'react';

/**
 * @beta
 */
export interface FileCardGroupProps {
  children: React.ReactNode;
}

/**
 * @beta
 */
export const FileCardGroup = (props: FileCardGroupProps): JSX.Element => {
  const { children } = props;
  return (
    <Stack
      horizontal
      className={mergeStyles({
        flexFlow: 'row wrap',
        '& > *': {
          marginRight: '0.5rem',
          marginTop: '0.5rem'
        }
      })}
    >
      {children}
    </Stack>
  );
};
