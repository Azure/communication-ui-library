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
  height: '100%',
  maxHeight: '4rem',
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

const containerStyle: IStyle = {
  height: '100%',
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
