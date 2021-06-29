// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const typingIndicatorContainerStyle = mergeStyles({
  height: '2.125rem'
});

export const typingIndicatorStringStyle = mergeStyles({
  fontWeight: 400,
  whiteSpace: 'pre',
  display: 'flex',
  alignItems: 'center'
});

export const typingIndicatorPrefixImageStyle = mergeStyles({
  width: '2.125rem',
  height: '2.125rem',
  paddingRight: '0.1875rem'
});
