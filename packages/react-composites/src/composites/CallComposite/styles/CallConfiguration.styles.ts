// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const configurationStackTokens: IStackTokens = {
  childrenGap: '2rem'
};

/**
 * @private
 */
export const configurationContainer = mergeStyles({
  height: '100%',
  width: '100% ',
  padding: '1rem', //half childrenGap from Stack
  minWidth: '14.5rem', // max of min-width from stack items + padding * 2 = 12.5 + 1 * 2
  minHeight: 'auto'
});

/**
 * @private
 */
export const selectionContainerStyle = mergeStyles({
  minWidth: '12.5rem',
  padding: '0.5rem'
});

/**
 * @private
 */
export const titleContainerStyle = mergeStyles({
  fontSize: '1.25rem',
  lineHeight: '1.75rem',
  fontWeight: 600,
  marginBottom: '1.563rem',
  width: '12.5rem'
});
