// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import { CSSProperties } from 'react';

export const chatMessageStyle = mergeStyles({
  fontWeight: '600'
});

// const parentHoveredSelector = `${chatMessageStyle}:hover &`;

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

export const chatMessageDateStyle: CSSProperties = {
  fontWeight: 600
};

export const chatMessageMenuStyle = mergeStyles({
  minWidth: '8.5rem',
  cursor: 'pointer'
});
