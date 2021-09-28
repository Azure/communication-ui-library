// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const gridLayoutContainerStyle = mergeStyles({
  width: '100%',
  height: '100%'
});

export const blockStyle = mergeStyles({
  width: '100%',
  height: '100%',
  display: 'grid'
});

export const cellStyle = mergeStyles({
  gap: '.25rem',
  padding: '.25rem'
});
