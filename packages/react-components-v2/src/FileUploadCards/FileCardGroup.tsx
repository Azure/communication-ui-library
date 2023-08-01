// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

import { _FileCardGroupProps } from './FileCardGroup.types';
import { _fileCardGroupClassName } from './FileCardGroup.styles';
import { mergeClasses } from '@fluentui/react-components';

/**
 * Used with `_FileCard` component where `_FileCard` components are passed as children.
 * Renders the children equally spaced in multiple rows.
 *
 * @internal
 */
export const _FileCardGroup = (props: _FileCardGroupProps): JSX.Element => {
  const { children, ariaLabel } = props;
  if (!children) {
    return <></>;
  }

  const internalStyles = _fileCardGroupClassName();

  return (
    <div className={mergeClasses(internalStyles.root, props.className)} aria-label={ariaLabel}>
      {children}
    </div>
  );
};
