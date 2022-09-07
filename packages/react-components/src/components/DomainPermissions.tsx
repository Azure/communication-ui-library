// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack, Text, Link, Icon, useTheme } from '@fluentui/react';
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
  sparkleIconBackdropStyles,
  textContainerStyles
} from './styles/DomainPermissions.styles';

/**
 * @internal
 * Props for DomainPermissions component.
 */
export interface DomainPermissionsProps {
  appName: string;
  onGetTroubleShooting: () => void;
  strings: DomainPermissionsStrings;
}

/**
 * @beta
 * Strings for DomainPermissions component
 */
export interface DomainPermissionsStrings {
  mainText: string;
  secondaryText: string;
  linkText: string;
}

const _DomainPermissionsContainer = (props: DomainPermissionsProps): JSX.Element => {
  const { appName, onGetTroubleShooting, strings } = props;

  const theme = useTheme();

  const appNameTrampoline = (): string => {
    /* @conditional-compile-remove(call-readiness) */
    return _formatString(strings.mainText, { appName: appName });
    // For Conditonal compilation will be undone when stable.
    return appName;
  };
  const containerWitdthTrampoline = (): string => {
    /* @conditional-compile-remove(call-readiness) */
    return `${_pxToRem(406)}`;
    return '406px';
  };
  return (
    <Stack style={{ padding: '2rem', maxWidth: containerWitdthTrampoline() }}>
      <Stack horizontal style={{ padding: '2rem 0' }} horizontalAlign={'space-between'}>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles(theme)} iconName={'ControlButtonCameraOn'}></Icon>
          <Icon styles={iconBackDropStyles(theme)} iconName={'iconBackdrop'}></Icon>
        </Stack>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={sparkleIconBackdropStyles(theme)} iconName={'sparkle'}></Icon>
        </Stack>
        <Stack styles={iconContainerStyles} horizontalAlign={'center'}>
          <Icon styles={iconPrimaryStyles(theme)} iconName={'ControlButtonMicOn'}></Icon>
          <Icon styles={iconBackDropStyles(theme)} iconName={'iconBackdrop'}></Icon>
        </Stack>
      </Stack>
      <Stack styles={textContainerStyles}>
        <Text styles={primaryTextStyles}>{appNameTrampoline()}</Text>
        <Text styles={secondaryTextStyles}>{strings.secondaryText}</Text>
        <Link styles={linkTextStyles} onClick={onGetTroubleShooting}>
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
export const _DomainPermissions = (props: DomainPermissionsProps): JSX.Element => {
  /* @conditional-compile-remove(call-readiness) */
  const locale = useLocale().strings.DomainPermissions;

  const domainPermissionsStringsTrampoiline = (): DomainPermissionsStrings => {
    /* @conditional-compile-remove(call-readiness) */
    return locale;
    // Done for conditional compilation will be undone in stable.
    return '' as unknown as DomainPermissionsStrings;
  };

  return <_DomainPermissionsContainer {...props} strings={domainPermissionsStringsTrampoiline()} />;
};
