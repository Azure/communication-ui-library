// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles } from '@fluentui/react';

/**
 * @private
 */
export const compositeOuterContainerStyles: IStackStyles = {
  root: {
    width: '100%',

    // This allows the composite to correctly contain the call composite by calculating a height for the available space.
    // Items inside the call composite that fill 100% of the height will now fill the height of this container instead
    // of the height of the child items.
    // If this css property is to be removed, test the participant pane correctly uses the scroll overflow when there a lot
    // of participants (i.e. beyond screen height) and where one participant is sharing their screen.
    flexWrap: 'wrap',

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
