// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

import { useFileUploadCardsStyles } from './FileUploadCards.styles';
import { _FileUploadCardsProps } from './FileUploadCards.types';
import { _FileCard } from './FileCard';

/**
 * File upload cards component
 *
 * @internal
 */
export const _FileUploadCards: ForwardRefComponent<_FileUploadCardsProps> = React.forwardRef((props, ref) => {
  const className = useFileUploadCardsStyles(props);
  const { activeFileUploads } = props;

  return (
    <div {...props} className={className} ref={ref}>
      {activeFileUploads &&
        activeFileUploads
          .filter((file) => !file.error)
          .map((file) => (
            <_FileCard

            />
          )
          )}
    </div>
  );
});

_FileUploadCards.displayName = 'FileUploadCards';
