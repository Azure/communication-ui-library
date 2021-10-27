// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackItemStyles, IStackStyles, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const callControlsStyles: IStackItemStyles = {
  root: {
    width: '100%'
  }
};

/**
 * @private
 */
export const callControlsContainer = mergeStyles({
  width: '100%',
  height: '3.875rem',
  padding: '0.0625rem 0',

  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
  justifyContent: 'center',

  '@media screen and (max-width: 30rem)': {
    label: {
      display: 'none'
    }
  }
});

/**
 * @private
 */
export const containerStyles: IStackStyles = {
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
    minHeight: '15rem' // linked to minimum space allocated to media gallery
  }
};

/**
 * @private
 */
export const subContainerStyles: IStackStyles = {
  root: {
    width: '100%',
    height: '100%'
  }
};

/**
 * @private
 */
export const mediaGalleryContainerStyles: IStackItemStyles = {
  root: {
    height: '100%'
  }
};

/**
 * @private
 */
export const bannersContainerStyles: IStackStyles = {
  root: {
    width: '100%',
    position: 'absolute',
    // High enough to be above the video gallary and <NetworkReconnectOverlay/>
    zIndex: 9,
    top: 0,
    left: 0,
    padding: '1rem'
  }
};
