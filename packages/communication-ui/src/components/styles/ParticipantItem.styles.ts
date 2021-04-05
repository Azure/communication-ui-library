// © Microsoft Corporation. All rights reserved.

import { mergeStyles } from '@fluentui/react';
import { Theme } from '@fluentui/react-theme-provider';

export const memberItemContainerStyle = (theme: Theme): string =>
  mergeStyles({
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    display: 'flex',
    position: 'relative',
    maxWidth: '20rem',
    minWidth: '12rem',
    cursor: 'pointer',
    selectors: {
      '&:hover': { background: theme.palette.neutralLight }
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
  marginTop: '0.3125rem'
});

export const iconContainerStyle = mergeStyles({
  position: 'absolute',
  display: 'flex',
  right: '1rem',
  top: '50%',
  msTransform: 'translateY(-50%)',
  transform: 'translateY(-50%)'
});
