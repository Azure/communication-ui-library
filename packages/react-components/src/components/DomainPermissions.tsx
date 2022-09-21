// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { Stack, Text, Link, Icon } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(call-readiness) */
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(call-readiness) */
import {
  iconBackDropStyles,
  iconContainerStyles,
  iconPrimaryStyles,
  linkTextStyles,
  primaryTextStyles,
  secondaryTextStyles,
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
  return (
    <Stack style={{ padding: '2rem', maxWidth: '25.375rem' }}>
      <Stack horizontal style={{ padding: '2rem 0' }} horizontalAlign={'space-between'}>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles} iconName={'ControlButtonCameraOn'}></Icon>
          <Icon styles={iconBackDropStyles} iconName={'iconBackdrop'}></Icon>
        </Stack>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles} iconName={'ControlButtonMicOn'}></Icon>
          <Icon styles={iconBackDropStyles} iconName={'iconBackdrop'}></Icon>
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
