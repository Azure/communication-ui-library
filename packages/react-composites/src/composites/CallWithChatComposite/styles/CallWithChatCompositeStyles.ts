// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles } from '@fluentui/react';

const DEFAULT_Z_INDEX = 1;

/**
 * @private
 */
export const compositeOuterContainerStyles: IStackStyles = {
  root: {
    width: '100%',

    // Create a new stacking context so that DrawerMenu can be positioned absolutely.
    position: 'relative'
  }
};

/** @private */
export const callCompositeContainerStyles: IStackStyles = {
  root: {
    // Start a new stacking context so that any `position:absolute` elements
    // inside the call composite do not compete with its siblings.
    position: 'relative'
  }
};

/** @private */
export const controlBarContainerStyles: IStackStyles = {
  root: {
    // Start a new stacking context so that any `position:absolute` elements
    // inside the control bar do not compete with its siblings.
    position: 'relative'
  }
};

/**
 * @private
 * Drawer styles to be used to house the _DrawerComponent on top of other content on the screen.
 * @param zIndex: this defaults to DEFAULT_Z_INDEX if unset
 */
export const drawerContainerStyles = (zIndex: number = DEFAULT_Z_INDEX): IStackStyles => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // Any zIndex > 0 will work because this is the only absolutely
    // positioned element in the container.
    zIndex: zIndex
  }
});

/**
 * Chat button might have a optional notification icon attached that must be positioned absolute inside the chat button.
 * this requires the parent to have `position relative`
 * @private
 */
export const ChatButtonContainerStyles: IStackStyles = {
  root: {
    position: 'relative'
  }
};
