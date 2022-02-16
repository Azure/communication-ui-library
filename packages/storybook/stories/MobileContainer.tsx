// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useTheme } from '@azure/communication-react';
import { Image, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';

/** @private */
export const MobilePreviewContainer = (props: { children: React.ReactNode }): JSX.Element => {
  const theme = useTheme();

  return (
    <Stack className={mergeStyles(mobilePreviewWidth, { boxShadow: theme.effects.elevation8 })}>
      <Stack.Item>
        <Image styles={mobilePreviewImageWidth} src="images/ios-device-header-light.svg" />
      </Stack.Item>
      <Stack.Item styles={mobileBodyHeight}>{props.children}</Stack.Item>
      <Stack.Item>
        <Image styles={mobilePreviewImageWidth} src="images/ios-device-footer-light.svg" />
      </Stack.Item>
    </Stack>
  );
};

const mobilePreviewWidth = { width: '15rem' };
const mobilePreviewImageWidth = { image: { width: '15rem' } };
const mobileBodyHeight = { root: { height: '25rem' } };
