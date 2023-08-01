// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

import { ForwardRefComponent } from '@fluentui/react-utilities';
import { _fileCardClassName } from './FileCard.styles';
import { _FileCardProps } from './FileCard.types';

/**
 * A component for displaying a file card with file icon and progress bar.
 *
 * @internal
 */
export const _FileCard: ForwardRefComponent<_FileCardProps> = React.forwardRef((props, ref) => {
  const className = _fileCardClassName(props);

  return (
    <div {...props} className={className} ref={ref}>
      FileCard v2 Component
    </div>
  );
});

_FileCard.displayName = 'FileCard';
