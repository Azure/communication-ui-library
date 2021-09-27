// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const editBoxStyle = mergeStyles({
  marginTop: '0.0875rem',
  marginBottom: '0.0875rem',
  paddingRight: '3.25rem'
});

/**
 * @private
 */
export const editingButtonStyle = mergeStyles({
  margin: 'auto .3rem'
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
    width: '100%',
    marginLeft: '6.25rem'
  }
};
