// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IModalStyles, IRatingStyles, Theme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const questionTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 600,
    fontSize: _pxToRem(20),
    lineHeight: _pxToRem(28),
    color: theme.palette.neutralPrimary,
    marginRight: _pxToRem(24)
  });

/**
 * @private
 */
export const helperTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(12),
    lineHeight: _pxToRem(16),
    color: theme.palette.neutralSecondary,
    paddingTop: _pxToRem(20)
  });

/**
 * @private
 */
export const ratingStyles = (): Partial<IRatingStyles> => {
  return {
    root: {
      marginBottom: _pxToRem(24),
      textAlign: 'center'
    },
    ratingStar: {
      fontSize: _pxToRem(35),
      margin: _pxToRem(5)
    }
  };
};

/**
 * @private
 */
export const modalStyles = (theme: Theme): Partial<IModalStyles> => {
  return {
    main: {
      borderRadius: theme.effects.roundedCorner6,
      padding: '1rem'
    }
  };
};

/**
 * @private
 */
export const titleContainerClassName = mergeStyles({
  paddingBottom: _pxToRem(8)
});

/**
 * @private
 */
export const confirmButtonClassName = mergeStyles({
  float: 'right',
  width: 'fit-content'
});
