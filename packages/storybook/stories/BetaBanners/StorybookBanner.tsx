// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, Stack } from '@fluentui/react';
import React from 'react';
import { BannerPalette, blueBannerPalette } from './BannerPalettes';
import { ImportantHeading } from './ImportantBannerHeading';

/**
 * @private
 */
export interface StorybookBannerProps {
  palette?: BannerPalette;
  children?: JSX.Element;
}

/** @private */
export const StorybookBanner = (props: StorybookBannerProps): JSX.Element => {
  const palette: BannerPalette = props.palette ?? blueBannerPalette;
  return (
    <Stack className={bannerContainerStyles(palette.background)}>
      <Stack.Item>
        <Stack style={{ display: 'inline-block' }}>
          <ImportantHeading color={palette.header} />
          {' - '}
          {props.children}
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

const bannerContainerStyles = (backgroundColor: string): string =>
  mergeStyles({
    background: backgroundColor,
    padding: '1rem',
    borderRadius: '0.375rem'
  });
