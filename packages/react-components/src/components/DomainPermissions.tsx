// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack, Text, Link, Icon } from '@fluentui/react';
import { useLocale } from '../localization';
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
export interface DomainPermissionsProps {
  appName: string;
  onGetTroubleShooting: () => void;
}

/**
 * @internal
 * Strings for DomainPermissions component
 */
export interface DomainPermissionsStrings {
  mainText: string;
  secondaryText: string;
  linkText: string;
}

/**
 * @internal
 *
 * Component to allow Contoso to help their end user with their devices should their permissions be blocked
 * by their browsers settings.
 */
export const _DomainPermissions = (props: DomainPermissionsProps): JSX.Element => {
  const { appName, onGetTroubleShooting } = props;

  const locale = useLocale();

  const strings = locale.strings.DomainPermissions;

  return (
    <Stack style={{ padding: '2rem', maxWidth: `${_pxToRem(406)}` }}>
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
        <Text styles={primaryTextStyles}>{_formatString(strings.mainText, { appName: appName })}</Text>
        <Text styles={secondaryTextStyles}>{strings.secondaryText}</Text>
        <Link styles={linkTextStyles} onClick={onGetTroubleShooting}>
          {strings.linkText}
        </Link>
      </Stack>
    </Stack>
  );
};
