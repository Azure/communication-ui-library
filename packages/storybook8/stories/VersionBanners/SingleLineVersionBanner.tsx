// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, Text } from '@fluentui/react';
import React from 'react';
import { StorybookBanner } from '../BetaBanners/StorybookBanner';

/**
 * @private
 */
export const SingleLineVersionBanner = (props: {
  version: string;
  topOfPage?: boolean;
  content?: string;
}): JSX.Element => {
  return (
    <Stack styles={props.topOfPage ? { root: { paddingTop: '1rem' } } : {}}>
      <StorybookBanner>
        <Stack style={{ display: 'inline-block' }}>
          <Text>
            {props.content ? props.content : 'Azure Communication UI Library supports up to React version'}{' '}
            {props.version}
          </Text>
        </Stack>
      </StorybookBanner>
    </Stack>
  );
};
