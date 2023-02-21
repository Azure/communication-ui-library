// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';

/**
 * Horizontal Gallery gap size in rem between tiles and buttons
 */
export const VERTICAL_GALLERY_GAP = 0.5;

/**
 * @private
 */
export const childrenContainerStyle: IStyle = {
  height: '100%',
  gap: `${VERTICAL_GALLERY_GAP}rem`
};

/**
 * @private
 */
export const rootStyle: IStyle = {
  height: '100%',
  width: '100%',
  gap: `${VERTICAL_GALLERY_GAP}rem`
};
