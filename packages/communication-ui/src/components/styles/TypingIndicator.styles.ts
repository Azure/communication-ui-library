// © Microsoft Corporation. All rights reserved.

import { mergeStyles } from '@fluentui/react';

export const TypingIndicatorContainerStyle = mergeStyles({
  height: '2.125rem',
  display: 'flex',
  alignItems: 'center'
});

export const TypingIndicatorListStyle = mergeStyles({
  fontWeight: 400,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingRight: '0.1875rem'
});

export const TypingIndicatorVerbStyle = mergeStyles({
  fontWeight: 400,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  paddingRight: '0.1875rem'
});

export const TypingIndicatorPrefixImageStyle = mergeStyles({
  width: '2.125rem',
  height: '2.125rem',
  paddingRight: '0.1875rem'
});
