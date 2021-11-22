// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Link, mergeStyles, Stack, Text } from '@fluentui/react';
import { WindowNew16Regular } from '@fluentui/react-icons';
import React from 'react';
import { MICROSOFT_AZURE_PREVIEWS_URL } from '../constants';
import { BannerPalette, blueBannerPalette } from './BannerPalettes';
import { ImportantHeading } from './ImportantBannerHeading';

/** @private */
export const DetailedBetaBanner = (props: { palette?: BannerPalette }): JSX.Element => {
  const palette: BannerPalette = props.palette ?? blueBannerPalette;
  return (
    <Stack className={bannerContainerStyles(palette.background)}>
      <Stack.Item>
        <ImportantHeading color={palette.header} />
      </Stack.Item>
      <Stack.Item>
        <Text className={mergeStyles({ lineHeight: '1.5rem' })}>
          This feature is currently in public preview. Public preview APIs may be unstable and are not recommended for
          production workloads. As such these features are only available in @azure/communication-react npm packages
          suffixed with -beta. For more information, see:{' '}
          <Link
            className={mergeStyles({ color: palette.link, fontWeight: '600' })}
            href={MICROSOFT_AZURE_PREVIEWS_URL}
            target="_blank"
          >
            Supplemental Terms of Use for Microsoft Azure Previews <WindowNew16Regular />
          </Link>
          .
        </Text>
      </Stack.Item>
    </Stack>
  );
};

const bannerContainerStyles = (color: string): string =>
  mergeStyles({
    background: color,
    borderRadius: '0.375rem',
    padding: '1rem',
    gap: '1rem',
    marginBottom: '2rem'
  });
