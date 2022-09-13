// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useTheme } from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import React from 'react';

/**
 * A container that display content in a desktop themed template.
 *
 * @private
 */
export const DesktopPreviewContainer = (props: { children: React.ReactNode }): JSX.Element => {
  const theme = useTheme();

  return (
    <Stack className={mergeStyles(desktopPreviewWidth, { boxShadow: theme.effects.elevation8 })}>
      <Stack.Item styles={desktopBodyStyles}>{props.children}</Stack.Item>
    </Stack>
  );
};

const desktopWidth = '858px';
const desktopBodyHeight = '480px';

const desktopPreviewWidth = {
  width: desktopWidth
};
const desktopBodyStyles = { root: { height: desktopBodyHeight } };
