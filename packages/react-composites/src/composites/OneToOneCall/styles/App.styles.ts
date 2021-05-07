// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const appContainer = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'auto'
});

export const incomingCallHost = mergeStyles({
  position: 'absolute',
  float: 'right',
  bottom: '3rem',
  right: '3rem'
});
