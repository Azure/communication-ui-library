// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import { MessageBar } from '@fluentui/react';
import { useTheme } from '@internal/react-components';
/* @conditional-compile-remove(spotlight) */
import React from 'react';
import { useLocale } from '../../localization';

/* @conditional-compile-remove(spotlight) */
/**
 * @private
 */
export interface SpotlightNotificationProps {
  onDismiss: () => void;
}

/* @conditional-compile-remove(spotlight) */
/**
 * @private
 */
export function SpotlightNotification(props: SpotlightNotificationProps): JSX.Element {
  const theme = useTheme();
  const locale = useLocale();

  return (
    <MessageBar
      styles={{
        root: {
          borderRadius: theme.effects.roundedCorner4,
          background: theme.palette.white,
          width: 'fit-content',
          minWidth: '20rem'
        },
        innerText: {
          fontSize: '0.875rem',
          alignSelf: 'center'
        },
        icon: {
          lineHeight: 0
        },
        dismissal: {
          lineHeight: 0
        }
      }}
      onDismiss={props.onDismiss}
      messageBarIconProps={{ iconName: 'Spotlighted' }}
      dismissIconProps={{ iconName: 'EditBoxCancel' }}
    >
      {locale.strings.call.spotlightedMessage}
    </MessageBar>
  );
}
