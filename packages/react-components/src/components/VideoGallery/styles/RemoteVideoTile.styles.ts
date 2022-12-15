// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';

/** @private */
export const drawerMenuWrapperStyles: { root: IStyle } = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // Any zIndex > 0 will work because this is the only absolutely
    // positioned element in the container.
    zIndex: 2
  }
};
