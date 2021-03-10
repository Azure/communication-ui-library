// © Microsoft Corporation. All rights reserved.

import { getTheme, mergeStyles } from '@fluentui/react';
import { CSSProperties } from 'react';

const palette = getTheme().palette;

export const memberItemContainerStyle = mergeStyles({
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
  display: 'flex',
  position: 'relative',
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

export const iconsDivStyle: CSSProperties = {
  display: 'flex',
  margin: 'auto'
};
