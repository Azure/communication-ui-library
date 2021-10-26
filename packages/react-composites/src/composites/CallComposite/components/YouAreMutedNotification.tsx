// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Stack, Text } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../localization';

export interface YouAreMutedNotificationProps {}
/**
 * Notify the user that they're muted.
 */
export function YouAreMutedNotification(props: YouAreMutedNotificationProps): JSX.Element {
  const locale = useLocale();
  return (
    <Stack>
      <Icon iconName="LocalDeviceSettingsSpeaker" />
      <Text>{locale.strings.call.youAreMutedMessage}</Text>
    </Stack>
  );
}
