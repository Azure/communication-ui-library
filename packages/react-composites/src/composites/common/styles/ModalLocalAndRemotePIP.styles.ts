// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  IModalStyleProps,
  IModalStyles,
  IStackStyles,
  IStyle,
  IStyleFunctionOrObject,
  ITheme
} from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * Styles for {@link ModalLocalAndRemotePIP} component
 */
export type ModalLocalAndRemotePIPStyles = { modal?: Partial<IModalStyles> };

/**
 * Default Modal PIP related pixel measurements used for ModalLocalAndremotePIP and common/utils.
 *
 * @private
 */
export const MODAL_PIP_DEFAULT_PX = {
  rightPositionPx: 16,
  topPositionPx: 52,
  widthPx: 88,
  heightPx: 128
};

/**
 * @private
 */
export const getPipStyles = (theme: ITheme): ModalLocalAndRemotePIPStyles => ({
  modal: {
    main: {
      borderRadius: theme.effects.roundedCorner4,
      boxShadow: theme.effects.elevation8,
      // Above the message thread / people pane.
      zIndex: 2,
      ...(theme.rtl
        ? { left: _pxToRem(MODAL_PIP_DEFAULT_PX.rightPositionPx) }
        : { right: _pxToRem(MODAL_PIP_DEFAULT_PX.rightPositionPx) }),
      top: _pxToRem(MODAL_PIP_DEFAULT_PX.topPositionPx)
    }
  }
});

/**
 * @private
 */
export const PIPContainerStyle: IStackStyles = {
  root: { position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }
};

/**
 * @private
 */
export const hiddenStyle: IStackStyles = concatStyleSets(PIPContainerStyle, { root: { display: 'none' } });

/**
 * @private
 */
export const modalStyle: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> = {
  main: {
    minWidth: 'min-content',
    minHeight: 'min-content',
    position: 'absolute',
    overflow: 'hidden',
    // pointer events for root Modal div set to auto to make LocalAndRemotePIP interactive
    pointerEvents: 'auto',
    touchAction: 'none'
  },
  root: {
    width: '100%',
    height: '100%',
    // pointer events for root Modal div set to none to make descendants interactive
    pointerEvents: 'none'
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
  zIndex: '100000',
  // pointer events for layerHost set to none to make descendants interactive
  pointerEvents: 'none'
};
