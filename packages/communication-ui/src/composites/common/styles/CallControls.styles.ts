// © Microsoft Corporation. All rights reserved.

import { getTheme } from '@fluentui/react';

const MODERATE_RED = '#d74654';
const DARK_RED = '#94102a';
const DARKER_RED = '#790d23';
const palette = getTheme().palette;

export const groupCallLeaveButtonStyle = {
  root: {
    background: MODERATE_RED,
    border: '0.125rem',
    borderRadius: 2,
    margin: '.75rem',
    height: '2.1875rem',
    width: '6.5625rem',
    color: palette.white
  },
  flexContainer: {
    flexFlow: 'row'
  },
  rootHovered: {
    backgroundColor: DARK_RED,
    color: palette.white
  },
  rootPressed: {
    backgroundColor: DARKER_RED,
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
