// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, Theme } from '@fluentui/react';

/**
 * @private
 */
export const groupCallLeaveButtonStyle = {
  root: {
    border: '0.125rem',
    borderRadius: 2,
    marginRight: '.75rem',
    height: '2.1875rem',
    width: '6.5625rem'
  },
  flexContainer: {
    flexFlow: 'row'
  }
};

/**
 * @private
 */
export const groupCallLeaveButtonCompressedStyle = {
  root: {
    border: '0',
    borderRadius: '0.5rem'
  },
  flexContainer: {
    flexFlow: 'row'
  }
};

/**
 * @private
 */
export const checkedButtonOverrideStyles = (theme: Theme, isChecked?: boolean) => ({
  rootChecked: {
    background: theme.palette.themePrimary,
    color: palette.white,
    ':focus::after': { outlineColor: `${palette.white} !important` }
  },
  label: isChecked ? { color: palette.white } : {}
});
