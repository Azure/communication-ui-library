// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { UnsupportedBrowser } from '@internal/react-components';
import React from 'react';
import { useLocale } from '../../localization';

/**
 * @internal
 */
export type UnsupportedBrowserPageProps = {
  onTroubleShootingClick: () => void;
};

/**
 *
 * @internal
 */
export const UnsupportedBrowserPage = (props: UnsupportedBrowserPageProps): JSX.Element => {
  const { onTroubleShootingClick } = props;
  const locale = useLocale();
  const unsupportedBrowserStrings = locale.component.strings.unsupportedBrowser;

  return (
    <Stack styles={{ root: { margin: 'auto', paddingTop: '3rem' } }}>
      <UnsupportedBrowser onTroubleShootingClick={onTroubleShootingClick} strings={unsupportedBrowserStrings} />
    </Stack>
  );
};
