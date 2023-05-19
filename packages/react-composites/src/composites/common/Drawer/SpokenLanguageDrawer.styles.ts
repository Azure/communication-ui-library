// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { _DrawerMenuStyles } from '@internal/react-components';

/**
 * @private
 */
export const spokenLanguageDrawerStyles = (theme: Theme): _DrawerMenuStyles => ({
  root: {
    height: '100%',
    overflow: 'auto'
  },
  drawerSurfaceStyles: {
    root: {
      // Targets FocusTrapZone in drawer specific to spokenLanguageDrawer so it does not impact
      // components using FocusTrapZone.
      // Setting percentage to Height to transform a container does not work unless the
      // direct parent container also has a Height set other than 'auto'.
      '> div:nth-child(2)': {
        height: '75%',
        overflow: 'auto'
      }
    },
    drawerContentContainer: {
      root: {
        height: '100%',
        span: {
          fontWeight: 600,
          fontSize: _pxToRem(17),
          lineHeight: _pxToRem(22),
          color: theme.palette.neutralDark
        }
      }
    }
  }
});
