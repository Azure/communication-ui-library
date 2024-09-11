// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useTheme } from '@azure/communication-react';
import { Image, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';

/**
 * A container that display content in an iOS themed template.
 *
 * @private
 */
export const MobilePreviewContainer = (props: { children: React.ReactNode }): JSX.Element => {
  const theme = useTheme();

  return (
    <Stack className={mergeStyles(mobilePreviewWidth, { boxShadow: theme.effects.elevation8 })}>
      <Stack.Item styles={mobileHeaderStyles}>
        <Image styles={mobilePreviewImageWidth} src="images/ios-device-header-light.svg" />
      </Stack.Item>
      <Stack.Item styles={mobileBodyStyles}>{props.children}</Stack.Item>
      <Stack.Item styles={mobileFooterStyles}>
        <Image styles={mobilePreviewImageWidth} src="images/ios-device-footer-light.svg" />
      </Stack.Item>
    </Stack>
  );
};

// Mobile size details taken from Figma iOS template
const mobileWidth = '23.4375rem';
const mobileHeaderHeight = '5.875rem';
const mobileBodyHeight = '39.6875rem';
const mobileFooterHeight = '5.1875rem';

const mobilePreviewWidth = {
  width: mobileWidth,

  /* Scale down the component to fit it in the storybook preview */
  transform: 'scale(0.75)'
};
const mobilePreviewImageWidth = { image: { width: mobileWidth } };
const mobileHeaderStyles = { root: { height: mobileHeaderHeight } };
const mobileBodyStyles = { root: { height: mobileBodyHeight } };
const mobileFooterStyles = { root: { height: mobileFooterHeight } };
