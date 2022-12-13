// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles } from '@fluentui/react';

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
 * Chat button might have a optional notification icon attached that must be positioned absolute inside the chat button.
 * this requires the parent to have `position relative`
 * @private
 */
export const ChatButtonContainerStyles: IStackStyles = {
  root: {
    position: 'relative'
  }
};

/** @private */
export const hiddenAutoFocusButtonStyles: IStackStyles = {
  root: {
    width: '0',
    height: '0',
    margin: '0',
    minHeight: '0',
    minWidth: '0',
    maxHeight: '0',
    maxWidth: '0',
    outline: 'none',
    padding: '0',
    position: 'absolute'
  }
};
