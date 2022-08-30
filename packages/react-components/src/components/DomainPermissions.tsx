// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack, Text, Link, Icon } from '@fluentui/react';
import { useLocale } from '../localization';
import { _formatString } from '@internal/acs-ui-common';

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
 */
export const DomainPermissions = (props: DomainPermissionsProps): JSX.Element => {
  const { appName, onGetTroubleShooting } = props;

  const locale = useLocale();

  const strings = locale.strings.DomainPermissions;

  return (
    <Stack>
      <Stack>
        <Icon iconName={'ControlButtonCameraOn'}></Icon>
        <Icon iconName={'sparkle'}></Icon>
        <Icon iconName={'ControlButtonMicOn'}></Icon>
      </Stack>
      <Text>{_formatString(strings.mainText, { appName: appName })}</Text>
      <Text>{strings.secondaryText}</Text>
      <Link onClick={onGetTroubleShooting}>{strings.linkText}</Link>
    </Stack>
  );
};
