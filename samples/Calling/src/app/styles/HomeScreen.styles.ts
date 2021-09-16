// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens, mergeStyles } from '@fluentui/react';

export const imgStyle = mergeStyles({
  width: '16em',
  '@media (max-width: 67.1875rem)': {
    display: 'none'
  }
});
export const containerTokens: IStackTokens = {
  childrenGap: '5em'
};
export const listStyle = mergeStyles({
  listStyleType: 'none',
  fontSize: '0.875em',
  margin: 0,
  padding: 0,
  listStylePosition: 'outside'
});
export const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '1.25em', // 20px
  lineHeight: '1.75em', // 28px
  width: '20em',
  marginBottom: '1.5em'
});
export const bodyItemStyle = mergeStyles({
  marginTop: '1.25em'
});
export const teamsItemStyle = mergeStyles({
  marginTop: '0.75em'
});
export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875em', // 14px
  width: '100%',
  height: '2.5em',
  borderRadius: 3,
  padding: '0.625em',
  marginTop: '1.25em'
});
