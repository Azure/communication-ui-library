// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Link, Stack, Text } from '@fluentui/react';
import { Info16Regular, WindowNew16Regular } from '@fluentui/react-icons';
import React from 'react';

/** @private */
export interface BannerPalette {
  background: string;
  header: string;
  link: string;
}

/** @private */
export interface BannerProps {
  palette?: BannerPalette;
}

/** @private */
export const FloatingSingleLineBetaBanner = (props: BannerProps): JSX.Element => (
  <Stack styles={{ root: { position: 'absolute', top: '0', width: '100%', textAlign: 'center' } }}>
    <SingleLineBetaBanner {...props} />
  </Stack>
);

/** @private */
export const SingleLineBetaBanner = (props: BannerProps): JSX.Element => {
  const palette: BannerPalette = props.palette ?? blueBannerPalette;
  return (
    <Stack
      styles={{
        root: {
          background: palette.background,
          padding: '1rem'
        }
      }}
    >
      <Stack.Item>
        <Info16Regular primaryFill={palette.header} />{' '}
        <Text styles={{ root: { lineHeight: '1.5rem', fontWeight: '600', color: palette.header } }}>Important</Text>
        {' - '}
        <Text>This feature is currently in Public Preview and not recommended for production use.</Text>{' '}
        <Link
          styles={{ root: { color: palette.link } }}
          underline={true}
          href="https://azure.microsoft.com/support/legal/preview-supplemental-terms/"
        >
          More info.
        </Link>
      </Stack.Item>
    </Stack>
  );
};

/** @private */
export const DetailedBetaBanner = (props: BannerProps): JSX.Element => {
  const palette: BannerPalette = props.palette ?? blueBannerPalette;
  return (
    <Stack
      styles={{
        root: {
          background: palette.background,
          borderRadius: '0.375rem',
          padding: '1rem',
          gap: '1rem',
          marginBottom: '2rem'
        }
      }}
    >
      <Stack.Item>
        <Info16Regular primaryFill={palette.header} />{' '}
        <Text styles={{ root: { lineHeight: '1.5rem', fontWeight: '600', color: palette.header } }}>Important</Text>
      </Stack.Item>
      <Stack.Item>
        <Text styles={{ root: { lineHeight: '1.5rem' } }}>
          This feature is currently in Public Preview. Public Preview APIs may be unstable and are not recommended for
          production workloads. As such these features are only available in @azure/communication-react npm packages
          suffixed with -beta. For more information, see:{' '}
          <Link
            styles={{ root: { color: palette.link, fontWeight: '600' } }}
            href="https://azure.microsoft.com/support/legal/preview-supplemental-terms/"
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

/** @private */
export const blueBannerPalette: BannerPalette = {
  background: '#d7eaf8',
  header: '#004173',
  link: '#004173'
};

/** @private */
export const purpleBannerPalette: BannerPalette = {
  background: '#efd9fd',
  header: '#3b2e58',
  link: '#3b2e58'
};
