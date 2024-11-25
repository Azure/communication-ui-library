// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ITheme, mergeStyles } from '@fluentui/react';

/**
 * Message Bar incorrectly applies dark theme and high contrast theme styles to links that have no hrefs.
 * This is a workaround to ensure that the link color is correct.
 *
 * More info: https://github.com/microsoft/fluentui/issues/14683
 *
 * @private
 */
export const messageBarLinkStyles = (theme: ITheme, underline?: boolean): string =>
  mergeStyles({
    textDecoration: underline ? 'underline' : 'none',
    color: theme.palette.themeDarkAlt,
    textDecorationColor: theme.palette.themeDarkAlt,
    '@media (forced-colors: active)': {
      color: 'LinkText',
      textDecorationColor: 'LinkText'
    }
  });
