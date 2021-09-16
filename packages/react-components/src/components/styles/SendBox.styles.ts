// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const suppressIconStyle = {
  iconContainer: { minHeight: '0', minWidth: '0', height: '0', width: '0', margin: '0' },
  icon: { display: 'none' }
};

export const sendBoxStyleSet = {
  root: {
    padding: '0.25em'
  }
};

export const sendBoxStyle = mergeStyles({
  paddingRight: '2em'
});

export const sendButtonStyle = mergeStyles({
  margin: 'auto .6em',
  paddingBottom: '1.125em'
});

export const sendIconStyle = mergeStyles({
  width: '1.0625em',
  height: '1.0625em',
  margin: 'auto'
});
