// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackItemStyles, IStackStyles, IStyle, mergeStyles } from '@fluentui/react';

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
  maxHeight: '4rem'
});

const containerStyle: IStyle = {
  width: '100%',
  position: 'relative',
  minHeight: '15rem' // linked to minimum space allocated to media gallery
};

/**
 * @private
 */
export const containerStyleDesktop = mergeStyles({
  ...containerStyle,
  minWidth: '30rem'
});

/**
 * @private
 */
export const containerStyleMobile = mergeStyles({
  ...containerStyle,
  minWidth: '19.5rem'
});

/**
 * @private
 */
export const subContainerStyles = (backgroundColor: string): IStackStyles => ({
  root: {
    width: '100%',
    background: backgroundColor
  }
});

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
export const notificationsContainerStyles = (zIndex: number): IStackStyles => ({
  root: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '1rem',
    zIndex
  }
});
