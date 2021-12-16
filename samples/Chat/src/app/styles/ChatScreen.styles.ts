// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const chatScreenContainerStyle = mergeStyles({
  height: '100%',
  width: '100%',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem'
});

export const chatHeaderContainerStyle = mergeStyles({
  position: 'absolute',
  alignSelf: 'flex-end',
  minHeight: '2.5rem'
});

export const chatCompositeContainerStyle = mergeStyles({
  width: '100%',
  height: '100%'
});
