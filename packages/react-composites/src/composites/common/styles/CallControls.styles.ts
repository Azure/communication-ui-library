// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme } from '@fluentui/react';

const palette = getTheme().palette;

export const groupCallLeaveButtonStyle = {
  root: {
    background: palette.red,
    border: '0.125rem',
    borderRadius: 2,
    marginRight: '.75rem',
    height: '2.1875rem',
    width: '6.5625rem',
    color: palette.white
  },
  flexContainer: {
    flexFlow: 'row'
  },
  rootHovered: {
    background: palette.redDark,
    color: palette.white
  },
  rootPressed: {
    background: palette.redDark,
    color: palette.white
  }
};

export const groupCallLeaveButtonCompressedStyle = {
  root: {
    width: '2rem',
    height: '3.75rem',
    border: '0.125rem',
    borderRadius: 2,
    marginRight: '0.4375rem'
  },
  flexContainer: {
    flexFlow: 'row'
  }
};
