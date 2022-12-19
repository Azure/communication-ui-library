// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, IStyle, Theme } from '@fluentui/react';

/** @private */
export const scaledIconStyles = (theme: Theme): IStyle => {
  return {
    transform: 'scale(2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: '0.2rem',
    color: theme.palette.themePrimary,
    zIndex: 1
  };
};

/** @private */
export const sitePermissionIconBackgroundStyle = (theme: Theme): IStackStyles => {
  return {
    root: {
      borderRadius: '100%',
      background: theme.palette.themeLighterAlt,
      padding: '2rem'
    }
  };
};
