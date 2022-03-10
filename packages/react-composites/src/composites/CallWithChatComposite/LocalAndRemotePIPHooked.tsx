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
  Modal,
  Stack
} from '@fluentui/react';
import React, { useMemo } from 'react';
import { CallAdapter } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { LocalAndRemotePIP } from '../CallComposite/components/LocalAndRemotePIP';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { useSelector } from '../CallComposite/hooks/useSelector';
import { localAndRemotePIPSelector } from '../CallComposite/selectors/localAndRemotePIPSelector';

/**
 * Drag options for Modal in {@link LocalAndRemotePIPHooked} component
 */
const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

/**
 * Styles for {@link LocalAndRemotePIPHooked} component
 */
export type LocalAndRemotePIPHookedStyles = { modal?: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> };

const _LocalAndRemotePIPHooked = (props: {
  hidden: boolean;
  modalLayerHostId: string;
  styles?: LocalAndRemotePIPHookedStyles;
}): JSX.Element => {
  const rootStyles = props.hidden ? hiddenStyle : availableSpaceStyle;
  const pictureInPictureProps = useSelector(localAndRemotePIPSelector);
  const pictureInPictureHandlers = useHandlers(LocalAndRemotePIP);
  const localAndRemotePIP = useMemo(
    () => <LocalAndRemotePIP {...pictureInPictureProps} {...pictureInPictureHandlers} />,
    [pictureInPictureProps, pictureInPictureHandlers]
  );

  const modalStylesThemed = concatStyleSets(
    modalStyle,
    { root: {} } /* needed to bypass type error */,
    props.styles?.modal
  );

  return (
    <Stack styles={rootStyles}>
      <Modal
        isOpen={true}
        isModeless={true}
        dragOptions={DRAG_OPTIONS}
        styles={modalStylesThemed}
        layerProps={{ hostId: props.modalLayerHostId }}
      >
        {
          // Only render LocalAndRemotePIP when this component is NOT hidden because VideoGallery needs to have
          // possession of the dominant remote participant video stream
          !props.hidden && localAndRemotePIP
        }
      </Modal>
    </Stack>
  );
};

/**
 * A wrapping component with a draggable {@link LocalAndRemotePIP} component that is bound to a LayerHost component with id
 * specified by `modalLayerHostId` prop
 * @private
 */
export const LocalAndRemotePIPHooked = (props: {
  callAdapter: CallAdapter;
  hidden: boolean;
  modalLayerHostId: string;
  children?: React.ReactNode;
  styles?: LocalAndRemotePIPHookedStyles;
}): JSX.Element => {
  return (
    <CallAdapterProvider adapter={props.callAdapter}>
      <_LocalAndRemotePIPHooked {...props}>{props.children}</_LocalAndRemotePIPHooked>
    </CallAdapterProvider>
  );
};

const availableSpaceStyle: IStackStyles = {
  root: { position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }
};

const hiddenStyle: IStackStyles = concatStyleSets(availableSpaceStyle, { root: { display: 'none' } });

const modalStyle: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> = {
  main: {
    minWidth: 'min-content',
    minHeight: 'min-content',
    position: 'absolute',
    zIndex: 1,
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
