// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const editBoxStyle = mergeStyles({
  marginTop: '0.0875rem',
  marginBottom: '0.0875rem'
});

/**
 * @private
 */
export const editingButtonStyle = mergeStyles({
  margin: 'auto 0',
  width: '2.125rem',
  height: '2.125rem',
  padding: '0.25rem 0 0 0'
});

/**
 * @private
 */
export const inputBoxIcon = mergeStyles({
  margin: 'auto',
  '&:hover svg': {
    stroke: 'currentColor'
  }
});

/**
 * @private
 */
export const editBoxStyleSet = {
  root: {
    minWidth: '6.25rem',
    maxWidth: '100%'
  }
};
