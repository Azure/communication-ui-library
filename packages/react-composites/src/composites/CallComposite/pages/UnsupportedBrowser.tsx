// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(unsupported-browser) */
import { Stack } from '@fluentui/react';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowser } from '@internal/react-components';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
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
  /* @conditional-compile-remove(unsupported-browser) */
  const { onTroubleShootingClick } = props;
  /* @conditional-compile-remove(unsupported-browser) */
  const locale = useLocale();
  /* @conditional-compile-remove(unsupported-browser) */
  const unsupportedBrowserStrings = locale.component.strings.UnsupportedBrowser;

  /* @conditional-compile-remove(unsupported-browser) */
  return (
    <Stack styles={{ root: { margin: 'auto', paddingTop: '3rem' } }}>
      <UnsupportedBrowser onTroubleShootingClick={onTroubleShootingClick} strings={unsupportedBrowserStrings} />
    </Stack>
  );
  return <></>;
};
