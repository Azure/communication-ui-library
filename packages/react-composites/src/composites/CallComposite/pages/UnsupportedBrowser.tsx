// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
import { IStackStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowser, UnsupportedBrowserVersion, UnsupportedOperatingSystem } from '@internal/react-components';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(unsupported-browser) */
import { useAdapter } from '../adapter/CallAdapterProvider';

/**
 * @internal
 */
export type UnsupportedBrowserPageProps = {
  onTroubleshootingClick?: () => void;
  /* @conditional-compile-remove(unsupported-browser) */
  environmentInfo?: EnvironmentInfo;
};

/**
 *
 * @internal
 */
export const UnsupportedBrowserPage = (props: UnsupportedBrowserPageProps): JSX.Element => {
  /* @conditional-compile-remove(unsupported-browser) */
  const { onTroubleshootingClick, environmentInfo } = props;
  /* @conditional-compile-remove(unsupported-browser) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(unsupported-browser) */
  const onContinueClick = (): void => {
    adapter.allowUnsupportedBrowserVersion();
  };

  /* @conditional-compile-remove(unsupported-browser) */
  const locale = useLocale();
  /* @conditional-compile-remove(unsupported-browser) */
  const unsupportedBrowserStrings = locale.component.strings.UnsupportedBrowser;
  /* @conditional-compile-remove(unsupported-browser) */
  const unsupportedBrowserVersionStrings = locale.component.strings.UnsupportedBrowserVersion;
  /* @conditional-compile-remove(unsupported-browser) */
  const unsupportedOperatingSystemStrings = locale.component.strings.UnsupportedOperatingSystem;

  let pageElement: JSX.Element | undefined = <></>;
  /* @conditional-compile-remove(unsupported-browser) */
  if (!environmentInfo?.isSupportedPlatform) {
    pageElement = (
      <UnsupportedOperatingSystem
        onTroubleshootingClick={onTroubleshootingClick}
        strings={unsupportedOperatingSystemStrings}
      />
    );
  } else if (!environmentInfo?.isSupportedBrowser) {
    pageElement = (
      <UnsupportedBrowser onTroubleshootingClick={onTroubleshootingClick} strings={unsupportedBrowserStrings} />
    );
  } else if (!environmentInfo?.isSupportedBrowserVersion) {
    pageElement = (
      <UnsupportedBrowserVersion
        onTroubleshootingClick={onTroubleshootingClick}
        strings={unsupportedBrowserVersionStrings}
        onContinueAnywayClick={onContinueClick}
      />
    );
  } else {
    throw new Error('There was a problem with your environment info');
  }

  return <Stack styles={containerStyles}>{pageElement}</Stack>;
};

const containerStyles: IStackStyles = {
  root: {
    margin: 'auto',
    paddingTop: '3rem'
  }
};
