// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import { IMessageBarStyles, MessageBar, Theme } from '@fluentui/react';
/* @conditional-compile-remove(spotlight) */
import { useTheme } from '@internal/react-components';
/* @conditional-compile-remove(spotlight) */
import React from 'react';
/* @conditional-compile-remove(spotlight) */
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
export function SpotlightedNotification(props: SpotlightNotificationProps): JSX.Element {
  const theme = useTheme();
  const locale = useLocale();

  return (
    <MessageBar
      styles={getMessageBarStyles(theme)}
      onDismiss={props.onDismiss}
      messageBarIconProps={{ iconName: 'Spotlighted' }}
      dismissIconProps={{ iconName: 'EditBoxCancel' }}
    >
      {locale.strings.call.spotlightedMessage}
    </MessageBar>
  );
}
/* @conditional-compile-remove(spotlight) */
const getMessageBarStyles = (theme: Theme): IMessageBarStyles => {
  return {
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
      height: 0,
      paddingTop: '0.8rem'
    }
  };
};
