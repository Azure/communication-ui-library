// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  IButtonStyles,
  IModalStyleProps,
  IModalStyles,
  IStackItemStyles,
  IStackStyles,
  IStackTokens,
  IStyle,
  IStyleFunctionOrObject,
  Theme
} from '@fluentui/react';

/**
 * @private
 */
export const peoplePaneContainerTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

/**
 * @private
 */
export const peoplePaneContainerStyle: IStackItemStyles = {
  root: {
    position: 'relative',
    maxHeight: '100%',
    overflow: 'hidden'
  }
};

/**
 * @private
 */
export const localAndRemotePIPStyles: IStackStyles = { root: { marginRight: '1rem' } };

/**
 * @private
 */
export const copyLinkButtonContainerStyles: IStackStyles = { root: { width: '100%', padding: '0.5rem 1rem' } };

/**
 * @private
 */
export const copyLinkButtonStyles: IButtonStyles = {
  root: {
    height: '3rem',
    width: '100%',
    borderRadius: '0.5rem'
  },
  textContainer: {
    display: 'contents'
  }
};

/**
 * @private
 */
export const linkIconStyles = { marginRight: '0.5rem' };

/**
 * @private
 */
export const modalStyle = (theme: Theme): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> => {
  return {
    main: {
      minWidth: 'min-content',
      minHeight: 'min-content',
      position: 'absolute',
      zIndex: 1,
      borderRadius: theme.effects.roundedCorner4,
      boxShadow: theme.effects.elevation8,
      overflow: 'hidden',
      ...(theme.rtl ? { left: '0.5rem' } : { right: '0.5rem' }),
      // pointer events for root Modal div set to auto to make LocalAndRemotePIP interactive
      pointerEvents: 'auto'
    },
    root: {
      // pointer events for root Modal div set to none to make descendants interactive
      pointerEvents: 'none'
    }
  };
};

/**
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
