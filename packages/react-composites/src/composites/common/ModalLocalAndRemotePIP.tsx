// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, ContextualMenu, IDragOptions, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { LocalAndRemotePIP } from '../CallComposite/components/LocalAndRemotePIP';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { useSelector } from '../CallComposite/hooks/useSelector';
import { localAndRemotePIPSelector } from '../CallComposite/selectors/localAndRemotePIPSelector';
import { _ModalClone, _ICoordinates } from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _RemoteVideoTile, _usePermissions } from '@internal/react-components';
import {
  hiddenStyle,
  ModalLocalAndRemotePIPStyles,
  modalStyle,
  PIPContainerStyle
} from './styles/ModalLocalAndRemotePIP.styles';

/**
 * Drag options for Modal in {@link ModalLocalAndRemotePIP} component
 */
const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

/**
 * A wrapping component with a draggable {@link LocalAndRemotePIP} component that is bound to a LayerHost component with id
 * specified by `modalLayerHostId` prop
 * @private
 */
export const ModalLocalAndRemotePIP = (props: {
  hidden: boolean;
  modalLayerHostId: string;
  styles?: ModalLocalAndRemotePIPStyles;
  minDragPosition?: _ICoordinates;
  maxDragPosition?: _ICoordinates;
}): JSX.Element | null => {
  const rootStyles = props.hidden ? hiddenStyle : PIPContainerStyle;

  /* @conditional-compile-remove(rooms) */
  const permissions = _usePermissions();

  const pictureInPictureProps = useSelector(localAndRemotePIPSelector);

  const pictureInPictureHandlers = useHandlers(LocalAndRemotePIP);
  const localAndRemotePIP = useMemo(() => {
    /* @conditional-compile-remove(rooms) */
    if (!permissions.cameraButton && pictureInPictureProps.dominantRemoteParticipant?.userId) {
      return <_RemoteVideoTile {...pictureInPictureProps.dominantRemoteParticipant} />;
    }
    return <LocalAndRemotePIP {...pictureInPictureProps} {...pictureInPictureHandlers} />;
  }, [
    pictureInPictureProps,
    pictureInPictureHandlers,
    /* @conditional-compile-remove(rooms) */ permissions.cameraButton
  ]);

  /* @conditional-compile-remove(rooms) */
  if (!permissions.cameraButton && !pictureInPictureProps.dominantRemoteParticipant) {
    return null;
  }

  const modalStylesThemed = concatStyleSets(modalStyle, props.styles?.modal);

  return (
    <Stack styles={rootStyles}>
      <_ModalClone
        isOpen={true}
        isModeless={true}
        dragOptions={DRAG_OPTIONS}
        styles={modalStylesThemed}
        layerProps={{ hostId: props.modalLayerHostId }}
        minDragPosition={props.minDragPosition}
        maxDragPosition={props.maxDragPosition}
      >
        {
          // Only render LocalAndRemotePIP when this component is NOT hidden because VideoGallery needs to have
          // possession of the dominant remote participant video stream
          !props.hidden && localAndRemotePIP
        }
      </_ModalClone>
    </Stack>
  );
};
