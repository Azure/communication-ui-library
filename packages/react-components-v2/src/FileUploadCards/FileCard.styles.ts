// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';

import { _FileCardProps } from './FileCard.types';

const useRootStyles = makeStyles({
  root: {

  }
});

/**
 * Styles for the {@link _FileCard}.
 *
 * @returns className
 *
 * @internal
 */
export const _fileCardClassName = (props: _FileCardProps): string => {
  const internalStyles = useRootStyles();
  return mergeClasses(internalStyles.root, props.className);
};
