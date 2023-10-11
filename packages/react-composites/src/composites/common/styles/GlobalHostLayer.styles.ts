// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStyle } from '@fluentui/react/lib/Styling';

/**
 * @private
 */
export const globalLayerHostStyle: IStyle = {
  position: 'fixed',
  zIndex: 1000000,
  inset: '0px',
  visibility: 'hidden'
};
