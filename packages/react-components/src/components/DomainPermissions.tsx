// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { Stack, Text, Link, Icon, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(call-readiness) */
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(call-readiness) */
import {
  iconContainerStyles,
  iconPrimaryStyles,
  linkTextStyles,
  primaryTextStyles,
  secondaryTextStyles,
  sparkleIconBackdropStyles,
  textContainerStyles
} from './styles/DomainPermissions.styles';

/**
 * @beta
 * Props for DomainPermissions component.
 */
export interface DomainPermissionsProps {
  /**
   * Name of application calling experience is in.
   */
  appName: string;
  /**
   * Action to be taken by the more help link. Possible to send to external page or show other modal.
   */
  onTroubleshootingClick: () => void;
  /**
   * Localization strings for DomainPermissions component.
   */
  strings: DomainPermissionsStrings;
}

/**
 * @beta
 * Strings for DomainPermissions component
 */
export interface DomainPermissionsStrings {
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
const DomainPermissionsContainer = (props: DomainPermissionsProps): JSX.Element => {
  const { appName, onTroubleshootingClick, strings } = props;
  const theme = useTheme();
  return (
    <Stack style={{ padding: '2rem', maxWidth: '25.375rem' }}>
      <Stack horizontal style={{ paddingBottom: '1rem' }} horizontalAlign={'space-between'}>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles} iconName={'DomainPermissionCamera'}></Icon>
        </Stack>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={sparkleIconBackdropStyles(theme)} iconName={'DomainPermissionsSparkle'}></Icon>
        </Stack>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles} iconName={'DomainPermissionMic'}></Icon>
        </Stack>
      </Stack>
      <Stack styles={textContainerStyles}>
        <Text styles={primaryTextStyles}>{_formatString(strings.primaryText, { appName: appName })}</Text>
        <Text styles={secondaryTextStyles}>{strings.secondaryText}</Text>
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
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 */
export const DomainPermissions = (props: DomainPermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings.DomainPermissions;
  /* @conditional-compile-remove(call-readiness) */
  return <DomainPermissionsContainer {...props} strings={locale} />;
  return <></>;
};
