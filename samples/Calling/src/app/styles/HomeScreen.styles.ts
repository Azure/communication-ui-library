// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens, mergeStyles } from '@fluentui/react';

export const imgStyle = mergeStyles({
  width: '16rem',
  '@media (max-width: 67.1875rem)': {
    display: 'none'
  }
});
export const containerTokens: IStackTokens = {
  childrenGap: '5rem'
};
export const listStyle = mergeStyles({
  listStyleType: 'none',
  fontSize: '0.875rem',
  margin: 0,
  padding: 0,
  listStylePosition: 'outside'
});
export const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1.25rem', // 20px
  lineHeight: '1.75rem', // 28px
  width: '20rem',
  marginBottom: '1.5rem'
});
export const bodyItemStyle = mergeStyles({
  marginTop: '1.25rem'
});
export const teamsItemStyle = mergeStyles({
  marginTop: '0.75rem'
});
export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  width: '100%',
  height: '2.5rem',
  borderRadius: 3,
  padding: '0.625rem',
  marginTop: '1.25rem'
});
