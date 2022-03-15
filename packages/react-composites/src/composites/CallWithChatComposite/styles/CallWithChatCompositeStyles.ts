// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, IStyle } from '@fluentui/react';

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

/** @private */
export const drawerContainerStyles: IStackStyles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // Any zIndex > 0 will work because this is the only absolutely
    // positioned element in the container.
    zIndex: 1
  }
};

/** @private */
export const drawerContainerMenuItemsStyles: IStackStyles = {
  root: {
    marginLeft: '0.5rem',
    marginRight: '0.5rem'
  }
};

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

/**
 * Styles for layer host to bound the modal wrapping PiPiP in the mobile pane.
 * @private
 */
export const modalLayerHostStyle: IStyle = {
  display: 'flex',
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  // pointer events for layerHost set to none to make descendants interactive
  pointerEvents: 'none'
};
