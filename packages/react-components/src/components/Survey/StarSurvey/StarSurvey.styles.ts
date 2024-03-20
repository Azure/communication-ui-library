// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IRatingStyles, Theme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const helperTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 600,
    fontSize: _pxToRem(16),
    lineHeight: _pxToRem(20),
    color: theme.palette.neutralPrimary,
    paddingTop: _pxToRem(24)
  });

/**
 * @private
 */
export const ratingHelperTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(12),
    lineHeight: _pxToRem(12),
    color: theme.palette.themePrimary,
    marginBottom: _pxToRem(8),
    marginTop: _pxToRem(8),
    textAlign: 'center'
  });

/**
 * @private
 */
export const ratingStyles = (theme: Theme): Partial<IRatingStyles> => {
  return {
    root: {
      textAlign: 'center',
      height: 'auto',
      marginTop: _pxToRem(8)
    },
    ratingStarIsLarge: {
      height: 'auto',
      padding: 0
    },
    ratingStar: {
      transform: 'scale(1.4)',
      margin: _pxToRem(6),
      height: 'auto'
    },
    ratingStarFront: {
      color: theme.palette.themePrimary
    }
  };
};

/**
 * @private
 */
export const titleContainerClassName = mergeStyles({
  paddingBottom: _pxToRem(6)
});
