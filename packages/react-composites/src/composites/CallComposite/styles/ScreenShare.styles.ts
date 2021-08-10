// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const videoStreamStyle = mergeStyles({
  position: 'absolute',
  bottom: '.25rem',
  right: '.25rem',
  height: 'auto',
  width: '25%'
});

export const loadingStyle = mergeStyles({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});
