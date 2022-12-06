// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ContextualMenu, IDragOptions } from '@fluentui/react';
import React, { useMemo } from 'react';
import { useTheme } from '../../theming';
import { _ICoordinates, _ModalClone } from '../ModalClone/ModalClone';
import {
  floatingLocalVideoModalStyle,
  LARGE_FLOATING_MODAL_SIZE_PX,
  localVideoTileOuterPaddingPX,
  SMALL_FLOATING_MODAL_SIZE_PX
} from '../styles/VideoGallery.styles';

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
export const FloatingLocalVideo = (props: {
  localVideoComponent: JSX.Element;
  layerHostId: string;
  isNarrow?: boolean;
  parentWidth?: number;
  parentHeight?: number;
}): JSX.Element => {
  const { localVideoComponent, layerHostId, isNarrow, parentWidth, parentHeight } = props;

  const theme = useTheme();

  const modalWidth = isNarrow ? SMALL_FLOATING_MODAL_SIZE_PX.width : LARGE_FLOATING_MODAL_SIZE_PX.width;
  const modalHeight = isNarrow ? SMALL_FLOATING_MODAL_SIZE_PX.height : LARGE_FLOATING_MODAL_SIZE_PX.height;
  // The minimum drag position is the top left of the video gallery. i.e. the modal (PiP) should not be able
  // to be dragged offscreen and these are the top and left bounds of that calculation.
  const modalMinDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      parentWidth && parentHeight
        ? {
            // We use -parentWidth/Height because our modal is positioned to start in the bottom right,
            // hence (0,0) is the bottom right of the video gallery.
            x: -parentWidth + modalWidth + localVideoTileOuterPaddingPX,
            y: -parentHeight + modalHeight + localVideoTileOuterPaddingPX
          }
        : undefined,
    [parentHeight, parentWidth, modalHeight, modalWidth]
  );

  return (
    <_ModalClone
      isOpen={true}
      isModeless={true}
      dragOptions={DRAG_OPTIONS}
      styles={floatingLocalVideoModalStyle(theme, isNarrow)}
      layerProps={{ hostId: layerHostId }}
      maxDragPosition={modalMaxDragPosition}
      minDragPosition={modalMinDragPosition}
    >
      {localVideoComponent}
    </_ModalClone>
  );
};
