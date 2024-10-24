// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Icon, Stack } from '@fluentui/react';

/**
 * Renders the icon component for the insert table button in the rich text editor toolbar.
 */
export const RichTextToolbarTableIcon = (): JSX.Element => {
  return (
    <Stack>
      <Icon iconName="RichTextInsertTableFilledIcon" className={'ribbon-table-button-filled-icon'} />
      <Icon iconName="RichTextInsertTableRegularIcon" className={'ribbon-table-button-regular-icon'} />
    </Stack>
  );
};
