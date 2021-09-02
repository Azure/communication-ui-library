// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, IStyle, FontWeights } from '@fluentui/react';

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

export const iconWrapperStyle = mergeStyles({
  padding: '0.375rem',
  webkitBoxPack: 'center',
  justifyContent: 'center'
});

export const chatMessageDateStyle = mergeStyles({ fontWeight: FontWeights.semibold });

export const chatMessageMenuStyle = mergeStyles({
  minWidth: '8.5rem',
  cursor: 'pointer'
});

export const menuIconStyleSet = { root: { height: 28, width: 20 } };
