// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, IDragOptions } from '@fluentui/react';
import React, { useMemo } from 'react';
import { useTheme } from '../../theming';
import { _ICoordinates, _ModalClone } from '../ModalClone/ModalClone';
import { floatingLocalVideoModalStyle, localVideoTileOuterPaddingPX } from './styles/FloatingLocalVideo.styles';

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
const modalMaxDragPosition = { x: localVideoTileOuterPaddingPX, y: localVideoTileOuterPaddingPX };

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
  // Local video width and height in px
  localVideoSize: {
    width: number;
    height: number;
  };
}

/**
 * @private
 */
export const FloatingLocalVideo = (props: FloatingLocalVideoProps): JSX.Element => {
  const { localVideoComponent, layerHostId, localVideoSize, parentWidth, parentHeight } = props;

  const theme = useTheme();

  // The minimum drag position is the top left of the video gallery. i.e. the modal (PiP) should not be able
  // to be dragged offscreen and these are the top and left bounds of that calculation.
  const modalMinDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      parentWidth && parentHeight
        ? {
            // We use -parentWidth/Height because our modal is positioned to start in the bottom right,
            // hence (0,0) is the bottom right of the video gallery.
            x: -parentWidth + localVideoSize.width + localVideoTileOuterPaddingPX,
            y: -parentHeight + localVideoSize.height + localVideoTileOuterPaddingPX
          }
        : undefined,
    [parentHeight, parentWidth, localVideoSize.width, localVideoSize.height]
  );

  const modalStyles = useMemo(() => floatingLocalVideoModalStyle(theme, localVideoSize), [theme, localVideoSize]);
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
    >
      {localVideoComponent}
    </_ModalClone>
  );
};
