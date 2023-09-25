// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import { _DrawerMenuStyles } from '@internal/react-components';

/**
 * @private
 */
export const captionSettingsDrawerStyles = (theme: Theme): _DrawerMenuStyles => ({
  root: {
    overflow: 'auto'
  },
  drawerSurfaceStyles: {
    drawerContentContainer: {
      root: {
        span: {
          fontWeight: 400,
          fontSize: _pxToRem(14),
          lineHeight: _pxToRem(22),
          color: theme.palette.neutralDark
        }
      }
    }
  }
});
