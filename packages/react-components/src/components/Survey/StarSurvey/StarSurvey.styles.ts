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
    fontSize: _pxToRem(14),
    lineHeight: _pxToRem(20),
    color: theme.palette.neutralPrimary,
    paddingTop: _pxToRem(20)
  });

/**
 * @private
 */
export const ratingStyles = (theme: Theme): Partial<IRatingStyles> => {
  return {
    root: {
      marginBottom: _pxToRem(24),
      textAlign: 'center'
    },
    ratingStar: {
      fontSize: _pxToRem(35),
      margin: _pxToRem(5)
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
