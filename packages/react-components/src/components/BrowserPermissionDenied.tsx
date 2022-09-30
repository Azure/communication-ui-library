// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { Stack, Text, Link, Icon, PrimaryButton } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(call-readiness) */
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(call-readiness) */
import {
  iconContainerStyles,
  iconPrimaryStyles,
  linkTextStyles,
  primaryButtonStyles,
  primaryTextStyles,
  secondaryTextStyles,
  textContainerStyles
} from './styles/BrowserPermissionDenied.styles';

/**
 * @beta
 * Props for BrowserPermissionDenied component.
 */
export interface BrowserPermissionDeniedProps {
  /**
   * Action to be taken by the more help link. Possible to send to external page or show other modal.
   */
  onTroubleshootingClick: () => void;
  /**
   * Action to be taken by the try again primary button.
   */
  onTryAgainClick: () => void;
  /**
   * Localization strings for BrowserPermissionDenied component.
   */
  strings: BrowserPermissionDeniedStrings;
}

/**
 * @beta
 * Strings for BrowserPermissionDenied component
 */
export interface BrowserPermissionDeniedStrings {
  /**
   * Main button text string.
   */
  primaryButtonText: string;
  /**
   * Main text string.
   */
  primaryText: string;
  /**
   * Subtext string.
   */
  secondaryText: string;
  /**
   * More help link string.
   */
  linkText: string;
}

/* @conditional-compile-remove(call-readiness) */
const BrowserPermissionDeniedContainer = (props: BrowserPermissionDeniedProps): JSX.Element => {
  const { onTroubleshootingClick, onTryAgainClick, strings } = props;
  return (
    <Stack style={{ padding: '2rem', paddingTop: '2.5rem', maxWidth: '25.375rem' }}>
      <Stack horizontal style={{ paddingBottom: '1.5rem' }} horizontalAlign={'space-between'}>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles} iconName={'BrowserPermissionDeniedError'}></Icon>
        </Stack>
      </Stack>
      <Stack styles={textContainerStyles}>
        <Text styles={primaryTextStyles}>{strings.primaryText}</Text>
        <Text styles={secondaryTextStyles}>{strings.secondaryText}</Text>
        <PrimaryButton styles={primaryButtonStyles} text={strings.primaryButtonText} onClick={onTryAgainClick} />
        <Link styles={linkTextStyles} onClick={onTroubleshootingClick}>
          {strings.linkText}
        </Link>
      </Stack>
    </Stack>
  );
};

/**
 * @beta
 *
 * Component to allow Contoso to help their end user with their devices should their browser experience device permission issues.
 */
export const BrowserPermissionDenied = (props: BrowserPermissionDeniedProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings.BrowserPermissionDenied;
  /* @conditional-compile-remove(call-readiness) */
  return <BrowserPermissionDeniedContainer {...props} strings={props.strings ? props.strings : locale} />;
  return <></>;
};
