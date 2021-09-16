// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, IStyle, FontWeights } from '@fluentui/react';

export const chatMessageStyle = mergeStyles({
  fontWeight: '600'
});

export const chatActionStyle = mergeStyles({
  visibility: 'hidden',
  width: '1em',
  height: '1em',
  cursor: 'pointer',
  [`.${chatMessageStyle}:hover &`]: {
    visibility: 'visible'
  },
  '& svg': {
    height: '1em',
    width: '1em'
  },
  '&:hover svg': {
    stroke: 'currentColor'
  }
});

export const chatActionsCSS: IStyle = {
  'ul&': {
    right: '0',
    left: 'auto',
    top: '-1.625em',
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
  padding: '0.375em',
  webkitBoxPack: 'center',
  justifyContent: 'center'
});

export const chatMessageDateStyle = mergeStyles({ fontWeight: FontWeights.semibold });

export const chatMessageMenuStyle = mergeStyles({
  minWidth: '8.5em',
  cursor: 'pointer'
});

export const menuIconStyleSet = { root: { height: 28, width: 20 } };
