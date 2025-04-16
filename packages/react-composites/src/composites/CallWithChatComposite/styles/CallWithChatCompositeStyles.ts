// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles } from '@fluentui/react';
import { compositeMinWidthRem } from '../../common/styles/Composite.styles';

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
export const callCompositeContainerStyles = (isMobile: boolean): IStackStyles => ({
  root: {
    // Start a new stacking context so that any `position:absolute` elements
    // inside the call composite do not compete with its siblings.
    position: 'relative',
    width: '100%',
    minWidth: isMobile ? 'unset' : `${compositeMinWidthRem}rem`
  }
});

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

/**
 * Style for stack containing the chat spinner used to delay showing chat composite until it is ready.
 * @private
 */
export const chatSpinnerContainerStyles: IStackStyles = {
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};
