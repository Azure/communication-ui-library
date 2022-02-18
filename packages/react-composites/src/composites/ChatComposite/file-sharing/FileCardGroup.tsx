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
 * Note: If we use stack tokens.childrenGap, when child elements are wrapped and moved to the next line,
 * an extra margin is added to the left of each line.
 * This is a workaround to avoid this issue.
 */
const fileCardGroupClassName = mergeStyles({
  flexFlow: 'row wrap',
  '& > *': {
    margin: '0.5rem',
    marginLeft: '0 rem'
  },
  ':not(:first-child)': {
    marginLeft: '0.5rem'
  }
});

/**
 * @beta
 */
export const FileCardGroup = (props: FileCardGroupProps): JSX.Element => {
  const { children } = props;

  return (
    <Stack horizontal className={fileCardGroupClassName}>
      {children}
    </Stack>
  );
};
