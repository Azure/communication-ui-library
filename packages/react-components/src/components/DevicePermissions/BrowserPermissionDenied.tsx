// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { IButtonStyles, ILinkStyles } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import { Stack, Text, Link, Icon, PrimaryButton, mergeStyleSets } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../../localization';
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
} from './../styles/BrowserPermissionDenied.styles';
import { BaseCustomStyles } from '../../types';
/* @conditional-compile-remove(call-readiness) */
import { isValidString } from '../utils';

/**
 * @beta
 * Props for BrowserPermissionDenied component.
 */
export interface BrowserPermissionDeniedProps {
  /**
   * Action to be taken by the more help link. Possible to send to external page or show other modal.
   */
  onTroubleshootingClick?: () => void;
  /**
   * Action to be taken by the try again primary button.
   */
  onTryAgainClick?: () => void;
  /**
   * Localization strings for BrowserPermissionDenied component.
   */
  strings?: BrowserPermissionDeniedStrings;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <BrowserPermissionDenied styles={{ primaryButton: { root: {backgroundColor: 'blue' }}}} />
   * ```
   */
  styles?: BrowserPermissionDeniedStyles;
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

/**
 * Fluent styles for {@link BrowserPermissionDenied}.
 *
 * @beta
 */
export interface BrowserPermissionDeniedStyles extends BaseCustomStyles {
  /** Styles for the primary button. */
  primaryButton?: IButtonStyles;
  /** Styles for the help troubleshooting link text. */
  troubleshootingLink?: ILinkStyles;
}

/* @conditional-compile-remove(call-readiness) */
const BrowserPermissionDeniedContainer = (props: BrowserPermissionDeniedProps): JSX.Element => {
  const { onTroubleshootingClick, onTryAgainClick, strings, styles } = props;
  return (
    <Stack style={{ padding: '2rem', paddingTop: '2.5rem', maxWidth: '25.375rem' }}>
      <Stack horizontal style={{ paddingBottom: '1.5rem' }} horizontalAlign={'space-between'}>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles} iconName={'BrowserPermissionDeniedError'}></Icon>
        </Stack>
      </Stack>
      <Stack styles={textContainerStyles}>
        {isValidString(strings?.primaryText) && <Text styles={primaryTextStyles}>{strings?.primaryText}</Text>}
        {isValidString(strings?.secondaryText) && <Text styles={secondaryTextStyles}>{strings?.secondaryText}</Text>}

        {onTryAgainClick && isValidString(strings?.primaryButtonText) && (
          <PrimaryButton
            styles={mergeStyleSets(primaryButtonStyles, styles?.primaryButton)}
            text={strings?.primaryButtonText}
            onClick={onTryAgainClick}
          />
        )}

        {onTroubleshootingClick && isValidString(strings?.linkText) && (
          <Link styles={mergeStyleSets(linkTextStyles, styles?.troubleshootingLink)} onClick={onTroubleshootingClick}>
            {strings?.linkText}
          </Link>
        )}
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
