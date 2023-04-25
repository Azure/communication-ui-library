// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, IDragOptions } from '@fluentui/react';
import { _convertRemToPx } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
import { useTheme } from '../../theming';
import { _ICoordinates, _ModalClone } from '../ModalClone/ModalClone';
import { floatingLocalVideoModalStyle, localVideoTileOuterPaddingRem } from './styles/FloatingLocalVideo.styles';

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

// Manually override the max position used to keep the modal in the bounds of its container.
// This is a workaround for: https://github.com/microsoft/fluentui/issues/20122
// Because our modal starts in the bottom right corner, we can say that this is the max (i.e. rightmost and bottomost)
// position the modal can be dragged to.
const modalMaxDragPosition = {
  x: _convertRemToPx(localVideoTileOuterPaddingRem),
  y: _convertRemToPx(localVideoTileOuterPaddingRem)
};

/**
 * @private
 */
export interface FloatingLocalVideoProps {
  // Local video component to make draggable
  localVideoComponent: JSX.Element;
  // Element id of layer host to constrain the dragging of local video
  layerHostId: string;
  // Parent component width in px
  parentWidth?: number;
  // Parent component height in px
  parentHeight?: number;
  // Local video width and height in rem
  localVideoSizeRem: {
    width: number;
    height: number;
  };
}

/**
 * @private
 */
export const FloatingLocalVideo = (props: FloatingLocalVideoProps): JSX.Element => {
  const { localVideoComponent, layerHostId, localVideoSizeRem, parentWidth, parentHeight } = props;

  const theme = useTheme();

  // The minimum drag position is the top left of the video gallery. i.e. the modal (PiP) should not be able
  // to be dragged offscreen and these are the top and left bounds of that calculation.
  const modalMinDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      parentWidth && parentHeight
        ? {
            // We use -parentWidth/Height because our modal is positioned to start in the bottom right,
            // hence (0,0) is the bottom right of the video gallery.
            x: -parentWidth + _convertRemToPx(localVideoSizeRem.width) + _convertRemToPx(localVideoTileOuterPaddingRem),
            y:
              -parentHeight + _convertRemToPx(localVideoSizeRem.height) + _convertRemToPx(localVideoTileOuterPaddingRem)
          }
        : undefined,
    [parentHeight, parentWidth, localVideoSizeRem.width, localVideoSizeRem.height]
  );

  const modalStyles = useMemo(() => floatingLocalVideoModalStyle(theme, localVideoSizeRem), [theme, localVideoSizeRem]);
  const layerProps = useMemo(() => ({ hostId: layerHostId }), [layerHostId]);

  return (
    <_ModalClone
      isOpen={true}
      isModeless={true}
      dragOptions={DRAG_OPTIONS}
      styles={modalStyles}
      layerProps={layerProps}
      maxDragPosition={modalMaxDragPosition}
      minDragPosition={modalMinDragPosition}
      data-ui-id="floating-local-video-host"
    >
      {localVideoComponent}
    </_ModalClone>
  );
};
