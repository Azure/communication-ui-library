// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, IStyle } from '@fluentui/react';
import { CSSProperties } from 'react';
import { InputBoxStylesProps } from '../InputBoxComponent';

export const chatMessageStyle = mergeStyles({
  fontWeight: '600'
});

export const chatActionStyle = mergeStyles({
  visibility: 'hidden',
  width: '1rem',
  height: '1rem',
  cursor: 'pointer',
  [`.${chatMessageStyle}:hover &`]: {
    visibility: 'visible'
  },
  '& svg': {
    height: '1rem',
    width: '1rem'
  },
  '&:hover svg': {
    stroke: 'currentColor'
  }
});

export const chatActionsCSS: IStyle = {
  'ul&': {
    boxShadow: '0 .2rem .4rem .1rem rgba(0, 0, 0, .1)',
    right: '0',
    left: 'auto',
    top: '-1.625rem',
    bottom: 'auto',
    position: 'absolute'
  },
  '& a': {
    margin: '0',
    padding: '0',
    border: '0'
  }
};

export const editBoxStyleSet = {
  root: {
    width: '100%',
    marginLeft: '6.25rem'
  }
};

export const iconWrapperStyle = mergeStyles({
  padding: '0.375rem',
  webkitBoxPack: 'center',
  justifyContent: 'center'
});

export const chatMessageDateStyle: CSSProperties = {
  fontWeight: 600
};

export const chatMessageMenuStyle = mergeStyles({
  minWidth: '8.5rem',
  cursor: 'pointer'
});

export const editBoxStyle = mergeStyles({
  marginTop: '0.0875rem',
  marginBottom: '0.0875rem',
  paddingRight: '3.25rem'
});

export const editingButtonStyle = mergeStyles({
  margin: 'auto .3rem'
});

export const inputBoxIcon = mergeStyles({
  margin: 'auto',
  '&:hover svg': {
    stroke: 'currentColor'
  }
});
