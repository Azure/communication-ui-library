// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const localPreviewContainerStyle = mergeStyles({
  borderRadius: '.25rem',
  width: '25rem',
  minWidth: '12.5rem',
  height: '18.75rem',
  padding: '0.5rem'
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
