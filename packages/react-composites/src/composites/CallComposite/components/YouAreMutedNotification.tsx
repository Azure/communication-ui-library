// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Stack, Text } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../localization';

export interface MutedNotificationProps {}
/**
 * Notify the user that they're muted.
 */
export function MutedNotification(props: MutedNotificationProps): JSX.Element {
  const locale = useLocale();
  return (
    <Stack>
      <Icon iconName="LocalDeviceSettingsSpeaker" />
      <Text>{locale.strings.call.mutedMessage}</Text>
    </Stack>
  );
}
