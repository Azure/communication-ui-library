// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IModalStyles, Theme } from '@fluentui/react';

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
      padding: '0 0.5rem',
      textAlign: isMobile ? 'center' : 'left',
      ':active': {
        padding: '0 0.5rem'
      }
    }
  },
  deleteIcon: {
    root: {
      backgroundColor: theme.palette.white
    }
  },
  digit: {
    color: theme.palette.themeDarkAlt
  }
});

/**
 * @private
 */
export const themedCallButtonStyle = (theme: Theme): Partial<IButtonStyles> => ({
  root: {
    fontWeight: theme.fonts.medium.fontWeight,
    fontSize: theme.fonts.medium.fontSize,
    width: '100%',
    height: '2.5rem',
    borderRadius: 3,
    padding: '0.625rem'
  },
  textContainer: {
    display: 'contents'
  }
});
