// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(unsupported-browser) */
import { DefaultButton, Icon, Link, Stack, Text } from '@fluentui/react';
/* @conditional-compile-remove(unsupported-browser) */
import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
import { useTheme } from '../theming';
/* @conditional-compile-remove(unsupported-browser) */
import {
  containerStyles,
  continueAnywayButtonStyles,
  linkTextStyles,
  mainTextStyles,
  secondaryTextStyles,
  testContainerStyles
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
  /** String for continue anyway button */
  continueAnywayButtonText?: string;
}

/**
 * props for {@link UnsupportedEnvironment} UI
 *
 * @private
 */
export interface UnsupportedEnvironmentProps {
  /**
   * Handler to perform a action when the help link is actioned
   */
  onTroubleshootingClick?: () => void;
  /**
   * String overrides for the component
   */
  strings?: UnsupportedEnvironmentStrings;
  /**
   * CallBack for the continue anyay button. Use this as a mechanism to allow users into
   * a call with a unsupported browser version.
   */
  onContinueAnywayClick?: () => void;
}

/* @conditional-compile-remove(unsupported-browser) */
const UnsupportedEnvironmentContainer = (props: UnsupportedEnvironmentProps): JSX.Element => {
  const { onTroubleshootingClick, strings, onContinueAnywayClick } = props;
  const theme = useTheme();
  return (
    <Stack styles={containerStyles} tokens={{ childrenGap: '2rem' }}>
      <Icon iconName="UnsupportedEnvironmentWarning" data-ui-id="unsupported-environment-icon"></Icon>
      <Stack styles={testContainerStyles} tokens={{ childrenGap: '0.25rem' }}>
        <Text styles={mainTextStyles}>{strings?.primaryText}</Text>
        <Text styles={secondaryTextStyles}>{strings?.secondaryText}</Text>
      </Stack>
      {onTroubleshootingClick && (
        <Link styles={linkTextStyles} onClick={onTroubleshootingClick} data-ui-id="unsupported-environment-link">
          {strings?.moreHelpLinkText}
        </Link>
      )}
      {onContinueAnywayClick && (
        <DefaultButton
          data-ui-id="allowUnsupportedBrowserButton"
          styles={continueAnywayButtonStyles(theme)}
          onClick={onContinueAnywayClick}
        >
          {strings?.continueAnywayButtonText}
        </DefaultButton>
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
