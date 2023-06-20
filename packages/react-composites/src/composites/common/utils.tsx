// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _ICoordinates, _useContainerHeight, _useContainerWidth } from '@internal/react-components';
import { useMemo, useRef } from 'react';
import { MODAL_PIP_DEFAULT_PX } from './styles/ModalLocalAndRemotePIP.styles';

/**
 * Interface for ModalLocalAndRemotePIP drag positions
 */
interface MinMaxDragPosition {
  minDragPosition: _ICoordinates | undefined;
  maxDragPosition: _ICoordinates | undefined;
}

/**
 * @private
 */
// Use document.getElementById until Fluent's Stack supports componentRef property: https://github.com/microsoft/fluentui/issues/20410
export const useMinMaxDragPosition = (modalLayerHostId: string, rtl?: boolean): MinMaxDragPosition => {
  const modalHostRef = useRef<HTMLElement>(document.getElementById(modalLayerHostId));
  const modalHostWidth = _useContainerWidth(modalHostRef);
  const modalHostHeight = _useContainerHeight(modalHostRef);
  const minDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      modalHostWidth === undefined
        ? undefined
        : {
            x: rtl
              ? -1 * MODAL_PIP_DEFAULT_PX.rightPositionPx
              : MODAL_PIP_DEFAULT_PX.rightPositionPx - modalHostWidth + MODAL_PIP_DEFAULT_PX.widthPx,
            y: -1 * MODAL_PIP_DEFAULT_PX.topPositionPx
          },
    [modalHostWidth, rtl]
  );
  const maxDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      modalHostWidth === undefined || modalHostHeight === undefined
        ? undefined
        : {
            x: rtl
              ? modalHostWidth - MODAL_PIP_DEFAULT_PX.rightPositionPx - MODAL_PIP_DEFAULT_PX.widthPx
              : MODAL_PIP_DEFAULT_PX.rightPositionPx,
            y: modalHostHeight - MODAL_PIP_DEFAULT_PX.topPositionPx - MODAL_PIP_DEFAULT_PX.heightPx
          },
    [modalHostHeight, modalHostWidth, rtl]
  );

  return { minDragPosition: minDragPosition, maxDragPosition: maxDragPosition };
};

/**
 * @private
 */
export const defaultSpokenLanguage = 'en-us';

/**
 * @private
 *  * Generate a unique id
 * TODO: Replace with useId() once React 18 becomes a required dependency.
 */
export const generateUniqueId = (): string => {
  return 'acr-' + Math.floor(Math.random() * Date.now()).toString(16);
};
