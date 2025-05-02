// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IIconStyles, IStackStyles, Theme } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const rttContainerStyles = (theme: Theme): IStackStyles => ({
  root: {
    boxShadow: theme.effects.elevation8,
    width: 'fit-content',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    position: 'relative',
    backgroundColor: theme.palette.white
  }
});

/**
 * @private
 */
export const rttIconStyles = (): IIconStyles => ({
  root: {
    fontSize: '1.5rem',
    paddingRight: '0.5rem'
  }
});
