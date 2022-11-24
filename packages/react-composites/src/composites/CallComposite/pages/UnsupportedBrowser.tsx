// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { EnvironmentInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { IStackStyles, Stack } from '@fluentui/react';
import { UnsupportedBrowser, UnsupportedBrowserVersion } from '@internal/react-components';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
import { useLocale } from '../../localization';

/**
 * @internal
 */
export type UnsupportedBrowserPageProps = {
  onTroubleshootingClick?: () => void;
  environmentInfo?: EnvironmentInfo;
};

/**
 *
 * @internal
 */
export const UnsupportedBrowserPage = (props: UnsupportedBrowserPageProps): JSX.Element => {
  const { onTroubleshootingClick, environmentInfo } = props;
  /* @conditional-compile-remove(unsupported-browser) */
  const locale = useLocale();
  /* @conditional-compile-remove(unsupported-browser) */
  const unsupportedBrowserStrings = locale.component.strings.UnsupportedBrowser;
  /* @conditional-compile-remove(unsupported-browser) */
  const unsupportedBrowserVersionStrings = locale.component.strings.UnsupportedBrowserVersion;

  let pageElement: JSX.Element | undefined;
  if (!environmentInfo?.isSupportedBrowser) {
    pageElement = (
      <UnsupportedBrowser onTroubleshootingClick={onTroubleshootingClick} strings={unsupportedBrowserStrings} />
    );
  } else if (!environmentInfo?.isSupportedBrowserVersion) {
    pageElement = (
      <UnsupportedBrowserVersion
        onTroubleshootingClick={onTroubleshootingClick}
        strings={unsupportedBrowserVersionStrings}
      />
    );
  }

  return <Stack styles={containerStyles}>{pageElement}</Stack>;
};

const containerStyles: IStackStyles = {
  root: {
    margin: 'auto',
    paddingTop: '3rem'
  }
};
