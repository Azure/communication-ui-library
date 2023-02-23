// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IMessageBarStyles, ITheme, MessageBarType } from '@fluentui/react';

/**
 * @private
 */
export const dismissButtonStyle = (theme: ITheme): IButtonStyles => ({
  root: {
    padding: '0.375rem 1.25rem',
    width: '3.75rem',
    height: '2rem',
    background: theme.palette.white,
    border: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
    borderRadius: '0.063rem',
    color: theme.palette.black
  }
});

/**
 * @private
 */
export const messageBarStyle = (theme: ITheme, errorType: MessageBarType): IMessageBarStyles => ({
  innerText: {
    paddingTop: errorType === MessageBarType.warning ? '0.15rem' : '0.1rem', // to move the inner text of the message bar down to be centered
    lineHeight: 'none',
    alignSelf: 'center',
    whiteSpace: 'normal'
  },
  icon: {
    marginTop: '0.375rem',
    marginBottom: '0.375rem',
    paddingTop: '0.25rem'
  },
  content: {
    lineHeight: 'inherit'
  },
  dismissal: {
    height: 0,
    paddingTop: '0.8rem'
  }
});
