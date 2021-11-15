// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const suppressIconStyle = {
  iconContainer: { minHeight: '0', minWidth: '0', height: '0', width: '0', margin: '0' },
  icon: { display: 'none' }
};

/**
 * @private
 */
export const sendBoxStyleSet = {
  root: {
    padding: '0.25rem'
  }
};

/**
 * @private
 */
export const sendBoxStyle = mergeStyles({
  paddingRight: '2rem'
});

/**
 * @private
 */
export const sendButtonStyle = mergeStyles({
  marginTop: '0.567rem',
  marginBottom: '0.559rem',
  height: '1.25rem',
  width: '1.25rem'
});

/**
 * @private
 */
export const sendIconStyle = mergeStyles({
  width: '1.25rem',
  height: '1.25rem',
  margin: 'auto'
});
