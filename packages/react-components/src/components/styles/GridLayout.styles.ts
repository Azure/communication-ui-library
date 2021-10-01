// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const gridLayoutStyle = mergeStyles({
  width: '100%',
  height: '100%',
  padding: '.5rem',
  display: 'grid',
  gridGap: '.5rem'
});

/**
 * @private
 */
export const blockStyle = mergeStyles({
  display: 'grid'
});

/**
 * @private
 */
export const cellStyle = mergeStyles({
  padding: '.25rem'
});
