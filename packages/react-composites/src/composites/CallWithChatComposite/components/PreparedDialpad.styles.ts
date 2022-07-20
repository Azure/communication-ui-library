// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IModalStyles, Theme } from '@fluentui/react';
/* @conditional-compile-remove(PSTN-calls) */
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

/* @conditional-compile-remove(PSTN-calls) */
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
      fontSize: theme.fonts.large.fontSize,
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
export const themedCallButtonStyle = (theme: Theme): Partial<IButtonStyles> => ({
  root: {
    fontWeight: 600,
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
