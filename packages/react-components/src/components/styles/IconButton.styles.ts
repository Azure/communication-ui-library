// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const iconButtonClassName = mergeStyles({
  color: 'unset',
  width: '1rem',
  height: '1rem',
  background: 'transparent',
  ':hover': {
    color: 'unset',
    background: 'transparent'
  }
});
