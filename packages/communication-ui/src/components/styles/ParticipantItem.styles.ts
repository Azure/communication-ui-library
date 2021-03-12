// © Microsoft Corporation. All rights reserved.

import { getTheme, mergeStyles, IStackTokens } from '@fluentui/react';

const palette = getTheme().palette;

export const memberItemContainerStyle = mergeStyles({
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  display: 'flex',
  position: 'relative',
  width: '100%',
  minWidth: '12rem',
  cursor: 'pointer',
  selectors: {
    '&:hover': { background: palette.neutralLight }
  }
});

export const memberItemNameStyle = mergeStyles({
  fontSize: '0.875rem', // 14px
  fontWeight: 400,
  marginTop: '0.3125rem',
  marginRight: '0.25rem',
  paddingLeft: '0.25rem',
  overflowY: 'hidden'
});

export const memberItemIsYouStyle = mergeStyles({
  fontSize: '0.875rem', // 14px
  fontWeight: 400,
  color: '#A19F9D',
  marginTop: '0.3125rem',
  marginLeft: '0.3125rem'
});

export const iconStackStyle = mergeStyles({
  position: 'absolute',
  display: 'flex',
  right: '1rem',
  top: '50%',
  msTransform: 'translateY(-50%)',
  transform: 'translateY(-50%)'
});

export const iconStackTokens: IStackTokens = {
  childrenGap: '0.5rem'
};
