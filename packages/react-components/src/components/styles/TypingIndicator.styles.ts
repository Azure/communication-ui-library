// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const typingIndicatorContainerStyle = mergeStyles({
  minHeight: '2.125rem',
  // flexFlow set to column-reverse to align the text to the bottom of the container
  flexFlow: 'column-reverse'
});

/**
 * @private
 */
export const typingIndicatorStringStyle = mergeStyles({
  fontWeight: 400,
  width: '100%',
  alignSelf: 'center',
  wordBreak: 'break-word'
});
