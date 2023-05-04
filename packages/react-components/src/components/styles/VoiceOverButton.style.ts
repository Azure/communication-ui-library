// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const buttonStyle = mergeStyles({
  color: 'grey',
  margin: '0',
  padding: '0',
  width: '1.0625rem',
  height: '1.0625rem',
  border: 'none',
  minWidth: '0',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent'
  }
});

/**
 * @private
 */
export const iconWrapperStyle = mergeStyles({
  position: 'absolute',
  pointerEvents: 'none',
  bottom: '2.6rem'
});
