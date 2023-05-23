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
    overflow: 'auto'
  },
  drawerSurfaceStyles: {
    root: {
      '> div:nth-child(2)': {
        height: '75%',
        overflow: 'auto'
      }
    },
    drawerContentContainer: {
      root: {
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
