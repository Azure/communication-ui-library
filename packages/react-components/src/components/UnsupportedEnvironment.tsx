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

/**
 * @private
 */
export interface UnsupportedEnvironmentStrings {
  /** String for the primary text */
  primaryText: string;
  /** String for the secondary text */
  secondaryText: string;
  /** String to display in the text for the help link */
  moreHelpLinkText: string;
}

/**
 * props for {@link UnsupportedEnvironment} UI
 *
 * @private
 */
export interface UnsupportedEnvironmentProps {
  /** Handler to perform a action when the help link is actioned */
  onTroubleshootingClick?: () => void;
  /** String overrides for the component */
  strings: UnsupportedEnvironmentStrings;
}

/* @conditional-compile-remove(unsupported-browser) */
const UnsupportedEnvironmentContainer = (props: UnsupportedEnvironmentProps): JSX.Element => {
  const { onTroubleshootingClick, strings } = props;
  return (
    <Stack styles={containerStyles}>
      <Icon
        styles={iconStyles}
        iconName="UnsupportedEnvironmentWarning"
        data-ui-id="unsupported-environment-icon"
      ></Icon>
      <Text styles={mainTextStyles}>{strings.primaryText}</Text>
      <Text styles={secondaryTextStyles}>{strings.secondaryText}</Text>
      {onTroubleshootingClick && (
        <Link
          styles={linkTextStyles}
          onClick={() => {
            onTroubleshootingClick();
          }}
          data-ui-id="unsupported-environment-link"
        >
          {strings.moreHelpLinkText}
        </Link>
      )}
    </Stack>
  );
};

/**
 * UI to display to the user that the environment they are using is not supported by calling application.
 *
 * @private
 */
export const UnsupportedEnvironment = (props: UnsupportedEnvironmentProps): JSX.Element => {
  /* @conditional-compile-remove(unsupported-browser) */
  return <UnsupportedEnvironmentContainer {...props} />;
  return <></>;
};
