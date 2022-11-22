// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(unsupported-browser) */
import { IStackStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowser } from '@internal/react-components';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
import { useLocale } from '../../localization';

/**
 * @internal
 */
export type UnsupportedBrowserPageProps = {
  onTroubleshootingClick?: () => void;
};

/**
 *
 * @internal
 */
export const UnsupportedBrowserPage = (props: UnsupportedBrowserPageProps): JSX.Element => {
  /* @conditional-compile-remove(unsupported-browser) */
  const { onTroubleshootingClick } = props;
  /* @conditional-compile-remove(unsupported-browser) */
  const locale = useLocale();
  /* @conditional-compile-remove(unsupported-browser) */
  const unsupportedBrowserStrings = locale.component.strings.UnsupportedBrowser;

  /* @conditional-compile-remove(unsupported-browser) */
  return (
    <Stack styles={containerStyles}>
      <UnsupportedBrowser onTroubleshootingClick={onTroubleshootingClick} strings={unsupportedBrowserStrings} />
    </Stack>
  );
  return <></>;
};

/* @conditional-compile-remove(unsupported-browser) */
const containerStyles: IStackStyles = {
  root: {
    margin: 'auto',
    paddingTop: '3rem'
  }
};
