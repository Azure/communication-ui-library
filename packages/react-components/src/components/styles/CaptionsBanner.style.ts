// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const gridContainerClassName = mergeStyles({
  overflowY: 'scroll',
  overflowX: 'hidden',
  width: '100%',
  height: _pxToRem(60),
  display: 'grid',
  gridTemplateColumns: '20% 80%',
  alignItems: 'stretch',
  columnGap: _pxToRem(16),
  padding: _pxToRem(8)
});

/**
 * @private
 */
export const displayNameClassName = mergeStyles({
  fontWeight: 600,
  fontSize: _pxToRem(12),
  lineHeight: _pxToRem(30)
});

/**
 * @private
 */
export const captionClassName = mergeStyles({
  fontWeight: 400,
  fontSize: _pxToRem(16),
  lineHeight: _pxToRem(30)
});
