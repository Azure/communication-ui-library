// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

const videoBaseStyle = mergeStyles({
  border: 0
});

export const gridStyle = mergeStyles(videoBaseStyle, {
  width: '100%',
  height: '100%'
});

export const videoTileStyle = {
  root: {
    borderRadius: '.25rem'
  }
};

export const disabledVideoHint = mergeStyles({
  bottom: '5%',
  height: '1.75rem',
  boxShadow: 'none',
  fontSize: '1.25rem',
  lineHeight: '1.0625rem',
  textAlign: 'left',
  left: '2%',
  overflow: 'hidden',
  position: 'absolute',
  padding: '0.25rem',
  whiteSpace: 'nowrap',
  maxWidth: '95%',
  borderRadius: 4
});

export const videoHint = mergeStyles(disabledVideoHint, {
  backgroundColor: '#605e5c',
  boxShadow: '0 0 1px 0 rgba(0,0,0,.16)',
  color: '#f3f2f1'
});
