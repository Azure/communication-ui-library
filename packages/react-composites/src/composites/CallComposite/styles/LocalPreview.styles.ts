// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';

const localPreviewContainerStyle: IStyle = {
  borderRadius: '.25rem',
  minWidth: '12.5rem'
};

/**
 * @private
 */
export const localPreviewContainerStyleDesktop = mergeStyles({
  ...localPreviewContainerStyle,
  width: '25rem',
  height: '18.75rem',
  padding: '0.5rem'
});

/**
 * @private
 */
export const localPreviewContainerStyleMobile = mergeStyles({
  ...localPreviewContainerStyle,
  width: '100%',
  height: '100%'
});

/**
 * @private
 */
export const cameraOffLabelStyle = mergeStyles({
  fontFamily: 'Segoe UI Regular',
  fontSize: '0.625rem' // 10px
});

/**
 * @private
 */
export const localPreviewTileStyle = {
  root: {
    borderRadius: '.25rem'
  }
};
