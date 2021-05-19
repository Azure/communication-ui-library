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
