// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  concatStyleSets,
  ContextualMenu,
  IDragOptions,
  IModalStyleProps,
  IModalStyles,
  IStackStyles,
  IStyleFunctionOrObject,
  Stack
} from '@fluentui/react';
import React, { useMemo } from 'react';
import { CallAdapter } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { LocalAndRemotePIP } from '../CallComposite/components/LocalAndRemotePIP';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { useSelector } from '../CallComposite/hooks/useSelector';
import { localAndRemotePIPSelector } from '../CallComposite/selectors/localAndRemotePIPSelector';
import { _ModalClone, _ICoordinates } from '@internal/react-components';

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
 * Styles for {@link ModalLocalAndRemotePIP} component
 */
export type ModalLocalAndRemotePIPStyles = { modal?: Partial<IModalStyles> };

const _ModalLocalAndRemotePIP = (props: {
  hidden: boolean;
  modalLayerHostId: string;
  styles?: ModalLocalAndRemotePIPStyles;
  minDragPosition?: _ICoordinates;
  maxDragPosition?: _ICoordinates;
}): JSX.Element => {
  const rootStyles = props.hidden ? hiddenStyle : PIPContainerStyle;
  const pictureInPictureProps = useSelector(localAndRemotePIPSelector);
  const pictureInPictureHandlers = useHandlers(LocalAndRemotePIP);
  const localAndRemotePIP = useMemo(
    () => <LocalAndRemotePIP {...pictureInPictureProps} {...pictureInPictureHandlers} />,
    [pictureInPictureProps, pictureInPictureHandlers]
  );

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

/**
 * A wrapping component with a draggable {@link LocalAndRemotePIP} component that is bound to a LayerHost component with id
 * specified by `modalLayerHostId` prop
 * @private
 */
export const ModalLocalAndRemotePIP = (props: {
  callAdapter: CallAdapter;
  hidden: boolean;
  modalLayerHostId: string;
  children?: React.ReactNode;
  styles?: ModalLocalAndRemotePIPStyles;
  minDragPosition?: _ICoordinates;
  maxDragPosition?: _ICoordinates;
}): JSX.Element => {
  return (
    <CallAdapterProvider adapter={props.callAdapter}>
      <_ModalLocalAndRemotePIP {...props}>{props.children}</_ModalLocalAndRemotePIP>
    </CallAdapterProvider>
  );
};

const PIPContainerStyle: IStackStyles = {
  root: { position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }
};

const hiddenStyle: IStackStyles = concatStyleSets(PIPContainerStyle, { root: { display: 'none' } });

const modalStyle: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> = {
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
