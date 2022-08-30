// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack, Text, Link, Icon } from '@fluentui/react';

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

  return (
    <Stack>
      <Stack>
        <Icon iconName={''}></Icon>
        <Icon iconName={'sparkle'}></Icon>
        <Icon></Icon>
      </Stack>
      <Text>{appName}</Text>
      <Link onClick={onGetTroubleShooting}></Link>
    </Stack>
  );
};
