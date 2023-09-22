// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, IStyle } from '@fluentui/react';

/**
 * @private
 */
export const rootLayoutStyle: IStackStyles = {
  root: { position: 'relative', height: '100%', width: '100%' }
};

/**
 * @private
 */
export const innerLayoutStyle: IStackStyles = {
  root: { position: 'relative', height: '100%', width: '100%', padding: '0.5rem' }
};

/**
 * @private
 */
export const layerHostStyle: IStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  // pointer events for layerHost set to none to make descendants interactive
  pointerEvents: 'none'
};
