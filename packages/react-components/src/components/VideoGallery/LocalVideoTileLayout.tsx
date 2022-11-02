// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { mergeStyles, Stack, ContextualMenu, IDragOptions } from '@fluentui/react';
import React from 'react';
import { useTheme } from '../../theming';
import { _ICoordinates, _ModalClone } from '../ModalClone/ModalClone';
import {
  localVideoTileContainerStyle,
  floatingLocalVideoModalStyle,
  localVideoTileWithControlsContainerStyle,
  LOCAL_VIDEO_TILE_ZINDEX
} from '../styles/VideoGallery.styles';

/**
 * @private
 */
export interface _LocalVideoTileLayoutProps {
  shouldFloatLocalVideo: boolean;
  shouldFloatNonDraggableLocalVideo: boolean;
  horizontalGalleryPresent: boolean;
  localVideoTile?: JSX.Element;
  isNarrow: boolean;
  layerHostId: string;
  modalMaxDragPosition?: _ICoordinates;
  modalMinDragPosition?: _ICoordinates;
  remoteParticipantsLength: number;
}

const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

/**
 * @private
 */
export const _LocalVideoTileLayout = (props: _LocalVideoTileLayoutProps): JSX.Element => {
  const {
    shouldFloatLocalVideo,
    shouldFloatNonDraggableLocalVideo,
    localVideoTile,
    horizontalGalleryPresent,
    isNarrow,
    layerHostId,
    modalMaxDragPosition,
    modalMinDragPosition,
    remoteParticipantsLength
  } = props;

  const theme = useTheme();

  return (
    <>
      {shouldFloatLocalVideo &&
        !shouldFloatNonDraggableLocalVideo &&
        localVideoTile &&
        (horizontalGalleryPresent ? (
          <Stack className={mergeStyles(localVideoTileContainerStyle(theme, isNarrow))}>{localVideoTile}</Stack>
        ) : (
          <_ModalClone
            isOpen={true}
            isModeless={true}
            dragOptions={DRAG_OPTIONS}
            styles={floatingLocalVideoModalStyle(theme, isNarrow)}
            layerProps={{ hostId: layerHostId }}
            maxDragPosition={modalMaxDragPosition}
            minDragPosition={modalMinDragPosition}
          >
            {localVideoTile}
          </_ModalClone>
        ))}
      {
        // When we use showCameraSwitcherInLocalPreview it disables dragging to allow keyboard navigation.
        shouldFloatNonDraggableLocalVideo && localVideoTile && remoteParticipantsLength > 0 && (
          <Stack
            className={mergeStyles(localVideoTileWithControlsContainerStyle(theme, isNarrow), {
              boxShadow: theme.effects.elevation8,
              zIndex: LOCAL_VIDEO_TILE_ZINDEX
            })}
          >
            {localVideoTile}
          </Stack>
        )
      }
    </>
  );
};
