// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(unsupported-browser) */
import { Icon, Link, Stack, Text } from '@fluentui/react';
/* @conditional-compile-remove(unsupported-browser) */
import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
import {
  containerStyles,
  iconStyles,
  linkTextStyles,
  mainTextStyles,
  secondaryTextStyles
} from './styles/UnsupportedEnvironment.styles';
import { UnsupportedBrowserStrings } from './UnsupportedBrowser';
import { UnsupportedBrowserVersionStrings } from './UnsupportedBrowserVersion';

/**
 * props for UnsupportedBrowser UI
 *
 * @beta
 */
export interface UnsupportedEnvironmentProps {
  /** Handler to perform a action when the help link is actioned */
  onTroubleshootingClick?: () => void;
  /** String overrides for the component */
  strings: UnsupportedBrowserStrings | UnsupportedBrowserVersionStrings;
}

/* @conditional-compile-remove(unsupported-browser) */
const UnsupportedEnvironmentContainer = (props: UnsupportedEnvironmentProps): JSX.Element => {
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
          data-ui-id="unsupportedBrowserLink"
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
export const UnsupportedEnvironment = (props: UnsupportedEnvironmentProps): JSX.Element => {
  /* @conditional-compile-remove(unsupported-browser) */
  return <UnsupportedEnvironmentContainer {...props} />;
  return <></>;
};
