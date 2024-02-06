// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ICheckboxStyles, Theme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const questionTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 600,
    fontSize: _pxToRem(16),
    lineHeight: _pxToRem(20),
    color: theme.palette.neutralPrimary,
    marginTop: _pxToRem(8),
    marginBottom: _pxToRem(4)
  });

/**
 * @private
 */
export const helperTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 400,
    fontSize: _pxToRem(12),
    lineHeight: _pxToRem(16),
    marginTop: _pxToRem(4),
    color: theme.palette.neutralSecondary
  });

/**
 * @private
 */
export const checkboxClassName = mergeStyles({
  padding: _pxToRem(8),
  paddingLeft: 0
});

/**
 * @private
 */
export const freeFormTextCheckboxStyles: Partial<ICheckboxStyles> = {
  root: {
    paddingBottom: _pxToRem(8),
    width: '100%'
  },
  label: {
    width: '100%'
  }
};

/**
 * @private
 */
export const freeFormTextFieldClassName = mergeStyles({
  width: '100%',
  marginLeft: _pxToRem(4),
  input: {
    padding: 0
  }
});
