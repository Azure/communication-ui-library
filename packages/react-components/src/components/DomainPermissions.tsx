// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { Stack, Text } from '@fluentui/react';

/**
 * @internal
 * props for the Domain Permissions UI.
 */
export interface DomainPermissionsProps {
  appName: string;
  onGetTroubleShooting: () => void;
}
/**
 * @internal
 */
export const DomainPermissions = (props: DomainPermissionsProps): JSX.Element => {
  const { appName, onGetTroubleShooting } = props;

  return (
    <Stack>
      <Text>{appName}</Text>
    </Stack>
  );
};
