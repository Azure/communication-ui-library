// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IModalStyles, Theme, mergeStyles } from '@fluentui/react';
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
  width: 'fit-content',
  marginRight: _pxToRem(8)
});

/**
 * @private
 */
export const cancelButtonClassName = mergeStyles({
  float: 'right',
  width: 'fit-content'
});

/**
 * @private
 */
export const checkboxClassName = mergeStyles({
  padding: _pxToRem(8)
});

/**
 * @private
 */
export const buttonsContainerClassName = mergeStyles({
  marginTop: _pxToRem(16)
});
