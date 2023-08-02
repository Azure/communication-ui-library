// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Button } from '@fluentui/react-components';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

import { _extension } from '../utils';

import { useFileUploadCardsStyles } from './FileUploadCards.styles';
import { _FileUploadCardsProps } from './FileUploadCards.types';
import { _FileCard } from './FileCard';
import { CalendarCancel20Filled } from '@fluentui/react-icons';

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
              actionHandler={() => props.onCancelFileUpload?.(file.id)}
              actionIcon={<Button icon={<CalendarCancel20Filled />} />}
              fileName={file.fileName}
              fileExtension={_extension(file.fileName)}
              key={file.id}
              progress={file.progress}
              strings={props.strings}
            />
          ))}
    </div>
  );
});

_FileUploadCards.displayName = 'FileUploadCards';
