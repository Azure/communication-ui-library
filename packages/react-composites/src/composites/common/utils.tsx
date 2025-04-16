// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
export const isBoolean = (value: unknown): value is boolean => {
  return value !== null && typeof value === 'boolean';
};

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
      modalHostWidth === undefined || modalHostHeight === undefined
        ? undefined
        : {
            x: rtl
              ? -1 * MODAL_PIP_DEFAULT_PX.rightPositionPx
              : MODAL_PIP_DEFAULT_PX.rightPositionPx - modalHostWidth + MODAL_PIP_DEFAULT_PX.widthPx,
            y: -1 * modalHostHeight + MODAL_PIP_DEFAULT_PX.heightPx + MODAL_PIP_DEFAULT_PX.bottomPositionPx
          },
    [modalHostHeight, modalHostWidth, rtl]
  );
  const maxDragPosition: _ICoordinates | undefined = useMemo(
    () =>
      modalHostWidth === undefined
        ? undefined
        : {
            x: rtl
              ? modalHostWidth - MODAL_PIP_DEFAULT_PX.rightPositionPx - MODAL_PIP_DEFAULT_PX.widthPx
              : MODAL_PIP_DEFAULT_PX.rightPositionPx,
            y: MODAL_PIP_DEFAULT_PX.bottomPositionPx
          },
    [modalHostWidth, rtl]
  );

  return { minDragPosition: minDragPosition, maxDragPosition: maxDragPosition };
};

/**
 * @private
 */
export const defaultSpokenLanguage = 'en-us';

/**
 * @private
 */
export const busyWait = async (checkCondition: () => boolean, retryLimit?: number): Promise<void> => {
  const delayMs = 500;
  let retryCount = 0;
  while (!checkCondition()) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    if (!retryLimit || (retryLimit && retryCount++ >= retryLimit)) {
      break;
    }
  }
};
