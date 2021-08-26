// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens, getTheme, mergeStyles } from '@fluentui/react';

const palette = getTheme().palette;

export const imgStyle = mergeStyles({
  width: '26.813rem',
  height: '20.125rem',
  '@media (max-width: 53.438rem)': {
    display: 'none'
  }
});

export const containerTokens: IStackTokens = {
  childrenGap: 55
};

export const upperStackTokens: IStackTokens = {
  childrenGap: 42
};

export const nestedStackTokens: IStackTokens = {
  childrenGap: 12
};

export const listStyle = mergeStyles({
  listStyleType: 'none',
  paddingLeft: '0px',
  fontSize: '0.875rem' // 14px
});

export const iconStyle = mergeStyles({
  marginRight: 7,
  color: palette.themePrimary
});

export const headerStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '2.25rem', // 36px
  maxWidth: '23.188rem'
});

export const videoCameraIconStyle = mergeStyles({
  marginRight: '0.375rem',
  fontSize: '1.375rem' // 22px
});

export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  width: 'fit-content',
  height: '2.5rem',
  borderRadius: 3,
  '@media (max-width: 53.438rem)': {
    padding: '0.625rem'
  }
});

export const upperStackStyle = mergeStyles({
  '@media (max-width: 53.438rem)': {
    padding: '0.625'
  }
});

export const startChatTextStyle = mergeStyles({
  fontSize: '0.875rem' // 14px
});
