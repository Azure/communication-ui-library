// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(unsupported-browser) */
import { Icon, Link, Stack, Text } from '@fluentui/react';
/* @conditional-compile-remove(unsupported-browser) */
import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(unsupported-browser) */
import {
  containerStyles,
  iconStyles,
  linkTextStyles,
  mainTextStyles,
  secondaryTextStyles
} from './styles/UnsupportedEnvironment.styles';

/**
 * Strings for UnsupportedBrowser component
 *
 * @beta
 */
export interface UnsupportedOperatingSystemStrings {
  /** String for the primary text */
  primaryText: string;
  /** String for the secondary text */
  secondaryText: string;
  /** String for the help link */
  moreHelpLink: string;
}

/**
 * props for UnsupportedOperatingSystem UI
 *
 * @beta
 */
export interface UnsupportedOperatingSystemProps {
  /** Handler to perform a action when the help link is actioned */
  onTroubleshootingClick?: () => void;
  /** String overrides for the component */
  strings: UnsupportedOperatingSystemStrings;
}

/* @conditional-compile-remove(unsupported-browser) */
const UnsupportedOperatingSystemContainer = (props: UnsupportedOperatingSystemProps): JSX.Element => {
  const { onTroubleshootingClick, strings } = props;
  return (
    <Stack styles={containerStyles}>
      <Icon styles={iconStyles} iconName="UnsupportedBrowserWarning" data-ui-id="unsupportedBrowserIcon"></Icon>
      <Text styles={mainTextStyles}>{strings.primaryText}</Text>
      <Text styles={secondaryTextStyles}>{strings.secondaryText}</Text>
      {onTroubleshootingClick && (
        <Link
          styles={linkTextStyles}
          onClick={() => {
            onTroubleshootingClick();
          }}
          data-ui-id="unsupportedOperatingSystemLink"
        >
          {strings.moreHelpLink}
        </Link>
      )}
    </Stack>
  );
};

/**
 * UI to display to the user that the browser they are using is not supported by calling application.
 *
 * @beta
 */
export const UnsupportedOperatingSystem = (props: UnsupportedOperatingSystemProps): JSX.Element => {
  /* @conditional-compile-remove(unsupported-browser) */
  const strings = useLocale().strings.UnsupportedOperatingSystem;
  /* @conditional-compile-remove(unsupported-browser) */
  return <UnsupportedOperatingSystemContainer {...props} strings={strings} />;
  return <></>;
};
