// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const typingIndicatorContainerStyle = mergeStyles({
  height: '2.125rem'
});

/**
 * @private
 */
export const typingIndicatorStringStyle = mergeStyles({
  fontWeight: 400,
  whiteSpace: 'pre',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  alignSelf: 'center'
});

/**
 * @private
 */
export const typingIndicatorPrefixImageStyle = mergeStyles({
  width: '2.125rem',
  height: '2.125rem',
  paddingRight: '0.1875rem'
});
