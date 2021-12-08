// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Link, mergeStyles, Stack, Text } from '@fluentui/react';
import React from 'react';
import { MICROSOFT_AZURE_PREVIEWS_URL } from '../constants';
import { BannerPalette, blueBannerPalette } from './BannerPalettes';
import { ImportantHeading } from './ImportantBannerHeading';

/** @private */
export const SingleLineBetaBanner = (props: { palette?: BannerPalette }): JSX.Element => {
  const palette: BannerPalette = props.palette ?? blueBannerPalette;
  return (
    <Stack className={bannerContainerStyles(palette.background)}>
      <Stack.Item>
        <ImportantHeading color={palette.header} />
        {' - '}
        <Text>This feature is currently in public preview and not recommended for production use.</Text>{' '}
        <Link
          className={mergeStyles({ color: palette.link })}
          underline={true}
          href={MICROSOFT_AZURE_PREVIEWS_URL}
          target="_blank"
        >
          More info.
        </Link>
      </Stack.Item>
    </Stack>
  );
};

/** @private */
export const FloatingSingleLineBetaBanner = (props: { palette?: BannerPalette }): JSX.Element => (
  <Stack className={floatingStyles}>
    <SingleLineBetaBanner {...props} />
  </Stack>
);

const bannerContainerStyles = (backgroundColor: string): string =>
  mergeStyles({
    background: backgroundColor,
    padding: '1rem'
  });

const floatingStyles = mergeStyles({ position: 'absolute', top: '0', width: '100%', textAlign: 'center' });
