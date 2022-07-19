// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IModalStyles, Theme } from '@fluentui/react';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { DialpadStyles } from '@internal/react-components';

/**
 * @private
 */
export const themedDialpadModelStyle = (theme: Theme): Partial<IModalStyles> => ({
  main: {
    borderRadius: theme.effects.roundedCorner6,
    padding: '1rem'
  }
});

/* @conditional-compile-remove(PeoplePaneDropdown) */
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
      borderBottom: '1px solid lightgrey'
    },
    field: {
      backgroundColor: 'white',
      fontSize: '1.125rem',
      padding: '1.063rem 0.5rem',
      textAlign: isMobile ? 'center' : 'left',
      paddingTop: 0
    }
  },
  primaryContent: {
    color: theme.palette.themeDarkAlt
  }
});

/**
 * @private
 */
export const callButtonStyle: IButtonStyles = {
  root: {
    fontWeight: 600,
    fontSize: '0.875rem', // 14px
    width: '100%',
    height: '2.5rem',
    borderRadius: 3,
    padding: '0.625rem'
  },
  textContainer: {
    display: 'contents'
  }
};
