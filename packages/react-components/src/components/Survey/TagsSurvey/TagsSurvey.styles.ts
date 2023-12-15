// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Theme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const questionTextStyle = (theme: Theme): string =>
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
export const helperTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(12),
    lineHeight: _pxToRem(16),
    color: theme.palette.neutralPrimary
  });

/**
 * @private
 */
export const checkboxClassName = mergeStyles({
  padding: _pxToRem(8)
});
