// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Link, mergeStyles, Stack, Text } from '@fluentui/react';
import React from 'react';
import { MICROSOFT_AZURE_PREVIEWS_URL } from '../constants';
import { blueBannerPalette } from './BannerPalettes';
import { StorybookBanner, StorybookBannerProps } from './StorybookBanner';

/**
 * @private
 */
export const SingleLineBetaBanner = (props: { version?: string; topOfPage?: boolean }): JSX.Element => {
  const palette = blueBannerPalette;
  return (
    <Stack styles={props.topOfPage ? { root: { paddingTop: '1rem' } } : {}}>
      <StorybookBanner>
        <Stack style={{ display: 'inline-block' }}>
          <Text>
            This feature is currently in public preview {props.version ? 'version' : ''}{' '}
            {props.version ? (
              <b>
                {'>'}={props.version}
              </b>
            ) : (
              ''
            )}{' '}
            and not recommended for production use.{' '}
          </Text>
          <Link
            className={mergeStyles({ color: palette.link })}
            underline={true}
            href={MICROSOFT_AZURE_PREVIEWS_URL}
            target="_blank"
          >
            More info.
          </Link>
        </Stack>
      </StorybookBanner>
    </Stack>
  );
};

export const SingleLineBetaListBanner = (props: { version?: string; topOfPage?: boolean }): JSX.Element => {
  const palette = blueBannerPalette;
  return (
    <Stack styles={props.topOfPage ? { root: { paddingTop: '1rem' } } : {}}>
      <StorybookBanner>
        <Stack style={{ display: 'inline-block' }}>
          <Text>
            The following features are currently in public preview {props.version ? 'version' : ''}{' '}
            {props.version ? (
              <b>
                {'>'}={props.version}
              </b>
            ) : (
              ''
            )}{' '}
            and not recommended for production use.{' '}
          </Text>
          <Link
            className={mergeStyles({ color: palette.link })}
            underline={true}
            href={MICROSOFT_AZURE_PREVIEWS_URL}
            target="_blank"
          >
            More info.
          </Link>
        </Stack>
      </StorybookBanner>
    </Stack>
  );
};

/** @private */
export const FloatingSingleLineBetaBanner = (props: StorybookBannerProps): JSX.Element => (
  <Stack className={floatingStyles}>
    <StorybookBanner {...props} />
  </Stack>
);

const floatingStyles = mergeStyles({ position: 'absolute', top: '0', width: '100%', textAlign: 'center' });
