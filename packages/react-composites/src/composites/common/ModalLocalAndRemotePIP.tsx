// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, ContextualMenu, IDragOptions, Stack } from '@fluentui/react';
import React, { useCallback, useMemo, useState } from 'react';
import { LocalAndRemotePIP } from '../CallComposite/components/LocalAndRemotePIP';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { useSelector } from '../CallComposite/hooks/useSelector';
import { localAndRemotePIPSelector } from '../CallComposite/selectors/localAndRemotePIPSelector';
import { _ModalClone, _ICoordinates } from '@internal/react-components';
import { _RemoteVideoTile } from '@internal/react-components';
import {
  hiddenStyle,
  ModalLocalAndRemotePIPStyles,
  modalStyle,
  PIPContainerStyle
} from './styles/ModalLocalAndRemotePIP.styles';
import { useLocale } from '../localization';
import { getRole } from '../CallComposite/selectors/baseSelectors';

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
 * @private
 */
export interface ModalLocalAndRemotePIPStrings {
  /**
   * Aria label for dismiss control when using keyboard
   */
  dismissModalAriaLabel?: string;
}

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
  onDismissSidePane?: () => void;
  strings?: ModalLocalAndRemotePIPStrings;
}): JSX.Element | null => {
  const rootStyles = props.hidden ? hiddenStyle : PIPContainerStyle;

  const role = useSelector(getRole);

  const locale = useLocale();

  const pictureInPictureProps = useSelector(localAndRemotePIPSelector);

  const [touchStartTouches, setTouchStartTouches] = useState<React.TouchList | null>(null);

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (
        touchStartTouches &&
        touchStartTouches[0] &&
        touchStartTouches.length === 1 &&
        event.changedTouches[0] &&
        event.changedTouches.length === 1
      ) {
        const touchStartTouch = touchStartTouches[0];
        const touchEndTouch = event.changedTouches[0];
        if (
          Math.abs(touchStartTouch.clientX - touchEndTouch.clientX) < 10 &&
          Math.abs(touchStartTouch.clientY - touchEndTouch.clientY) < 10
        ) {
          props.onDismissSidePane?.();
        }
      }
    },
    [props, touchStartTouches]
  );

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    setTouchStartTouches(event.touches);
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        props.onDismissSidePane?.();
      }
    },
    [props]
  );

  const pictureInPictureHandlers = useHandlers(LocalAndRemotePIP);
  const remoteParticipant = pictureInPictureProps.remoteParticipant;

  const localAndRemotePIP = useMemo(() => {
    if (role === 'Consumer' && remoteParticipant?.userId) {
      return (
        <Stack tabIndex={0} aria-label={props.strings?.dismissModalAriaLabel ?? ''} onKeyDown={onKeyDown}>
          <_RemoteVideoTile
            strings={locale.component.strings.videoGallery}
            {...remoteParticipant}
            remoteParticipant={remoteParticipant}
          />
        </Stack>
      );
    }
    return (
      <Stack tabIndex={0} aria-label={props.strings?.dismissModalAriaLabel ?? ''} onKeyDown={onKeyDown}>
        <LocalAndRemotePIP
          {...pictureInPictureProps}
          {...pictureInPictureHandlers}
          remoteParticipant={remoteParticipant}
        />
      </Stack>
    );
  }, [
    role,
    onKeyDown,
    pictureInPictureProps,
    props,
    pictureInPictureHandlers,
    locale.component.strings.videoGallery,
    remoteParticipant
  ]);

  if (role === 'Consumer' && !remoteParticipant) {
    return null;
  }

  const modalStylesThemed = concatStyleSets(modalStyle, props.styles?.modal);

  return (
    <Stack styles={rootStyles}>
      <Stack onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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
    </Stack>
  );
};
