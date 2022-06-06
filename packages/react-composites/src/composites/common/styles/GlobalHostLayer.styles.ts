// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react/lib/Styling';

/**
 * @private
 */
export const globalLayerHostStyle: IStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  // pointer events for layerHost set to none to make descendants interactive
  pointerEvents: 'none',
  zIndex: 1000000
};
