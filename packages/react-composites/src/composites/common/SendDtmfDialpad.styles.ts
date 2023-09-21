// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IModalStyles, Theme } from '@fluentui/react';

import { DialpadStyles } from '@internal/react-components';

/**
 * @private
 */
export const themeddialpadModalStyle = (theme: Theme): Partial<IModalStyles> => ({
  main: {
    borderRadius: theme.effects.roundedCorner6,
    padding: '1rem'
  }
});

/**
 * @private
 */
export const themedDialpadStyle = (isMobile: boolean, theme: Theme): Partial<DialpadStyles> => ({
  root: {
    padding: 0,
    marginLeft: 0,
    marginRight: 0,
    maxWidth: '100%'
  },
  textField: {
    root: {
      borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`
    },
    field: {
      backgroundColor: theme.palette.white,
      fontSize: theme.fonts.large.fontSize,
      padding: '0 0.5rem ',
      textAlign: 'center',
      ':active': {
        padding: '0 0.5rem'
      }
    }
  },
  digit: {
    color: theme.palette.themeDarkAlt
  }
});
