// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const typingIndicatorContainerStyle = mergeStyles({
  minHeight: '2.125rem'
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
