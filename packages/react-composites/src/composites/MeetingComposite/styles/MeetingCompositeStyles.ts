// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IIconStyles, IStackStyles } from '@fluentui/react';

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
    flexWrap: 'wrap'
  }
};

/**
 * @private
 */
export const NotificationIconStyles: IIconStyles = {
  root: {
    color: '#0078D4'
  }
};

/**
 * @private
 */
export const NotificationTextStyles: IStackStyles = {
  root: {
    position: 'absolute',
    top: '0.1rem',
    color: 'white',
    fontSize: '0.8rem'
  }
};
