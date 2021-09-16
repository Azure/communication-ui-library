// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const chatScreenContainerStyle = mergeStyles({
  height: '100%',
  width: '100%',
  paddingTop: '1em',
  paddingBottom: '1em'
});

export const chatHeaderContainerStyle = mergeStyles({
  position: 'absolute',
  alignSelf: 'flex-end',
  minHeight: '2.5em'
});

export const chatCompositeContainerStyle = mergeStyles({
  height: '100%'
});
