// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack, Text, Link, Icon } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(call-readiness) */
import { _formatString, _pxToRem } from '@internal/acs-ui-common';
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
 * @internal
 * Props for DomainPermissions component.
 */
export interface _DomainPermissionsProps {
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
  mainText: string;
  /**
   * Subtext string.
   */
  secondaryText: string;
  /**
   * More help link string.
   */
  linkText: string;
}

const _DomainPermissionsContainer = (props: _DomainPermissionsProps): JSX.Element => {
  const { appName, onTroubleshootingClick, strings } = props;

  const appNameTrampoline = (): string => {
    /* @conditional-compile-remove(call-readiness) */
    return _formatString(strings.mainText, { appName: appName });
    // For Conditonal compilation will be undone when stable.
    return appName;
  };
  const containerWidthTrampoline = (): string => {
    /* @conditional-compile-remove(call-readiness) */
    return `${_pxToRem(406)}`;
    return '406px';
  };
  return (
    <Stack style={{ padding: '2rem', maxWidth: containerWidthTrampoline() }}>
      <Stack horizontal style={{ padding: '2rem 0' }} horizontalAlign={'space-between'}>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles} iconName={'ControlButtonCameraOn'}></Icon>
          <Icon styles={iconBackDropStyles} iconName={'iconBackdrop'}></Icon>
        </Stack>
        <Icon styles={iconPrimaryStyles} iconName={'Sparkle'}></Icon>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles} iconName={'ControlButtonMicOn'}></Icon>
          <Icon styles={iconBackDropStyles} iconName={'iconBackdrop'}></Icon>
        </Stack>
      </Stack>
      <Stack styles={textContainerStyles}>
        <Text styles={primaryTextStyles}>{appNameTrampoline()}</Text>
        <Text styles={secondaryTextStyles}>{strings.secondaryText}</Text>
        <Link styles={linkTextStyles} onClick={onTroubleshootingClick}>
          {strings.linkText}
        </Link>
      </Stack>
    </Stack>
  );
};

/**
 * @internal
 *
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 */
export const _DomainPermissions = (props: _DomainPermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings.DomainPermissions;

  const domainPermissionsStringsTrampoline = (): DomainPermissionsStrings => {
    /* @conditional-compile-remove(call-readiness) */
    return locale;
    // Done for conditional compilation will be undone in stable.
    return '' as unknown as DomainPermissionsStrings;
  };

  return <_DomainPermissionsContainer {...props} strings={domainPermissionsStringsTrampoline()} />;
};
