// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, mergeStyles } from '@fluentui/react';

const palette = getTheme().palette;

export const localPreviewContainerStyle = mergeStyles({
  borderRadius: '.25rem',
  width: '25rem',
  height: '18.75rem',
  color: palette.neutralPrimaryAlt
});

export const cameraOffLabelStyle = mergeStyles({
  fontFamily: 'Segoe UI Regular',
  fontSize: '0.625rem', // 10px
  color: palette.neutralTertiary
});

export const localPreviewTileStyle = {
  background: palette.neutralLighter,
  root: {
    borderRadius: '.25rem'
  }
};
