// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { _pxToRem } from '@internal/acs-ui-common';

import { _FileCardProps } from './FileCard.types';

const useRootStyles = makeStyles({
  root: {
    width: '12rem',
    backgroundColor: tokens.colorNeutralBackground2,
    // borderRadius: tokens.borderRadiusSmall,
    // border: `${_pxToRem(1)} solid ${theme.palette.neutralQuaternary}`,
    cursor: 'pointer'
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
