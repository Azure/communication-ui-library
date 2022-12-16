// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, IStackStyles } from '@fluentui/react';
import { _ICoordinates, _useContainerHeight, _useContainerWidth } from '@internal/react-components';
import React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
 *  hidden button to set first tab keypress focus on a specific grouping.
 *  On mount, button is autofocused then immediately hidden
 */
export const HiddenFocusStartPoint = (): JSX.Element => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <DefaultButton
      autoFocus
      ariaHidden={true}
      styles={isMounted ? invisibleHiddenFocusStartPoint : hiddenFocusStartPointStyles}
      tabIndex={-1}
    />
  );
};

/** @private */
const hiddenFocusStartPointStyles: IStackStyles = {
  root: {
    width: '0',
    height: '0',
    margin: '0',
    minHeight: '0',
    minWidth: '0',
    maxHeight: '0',
    maxWidth: '0',
    opacity: '0',
    outline: 'none',
    padding: '0',
    position: 'absolute'
  }
};

/** @private */
const invisibleHiddenFocusStartPoint: IStackStyles = {
  root: {
    display: 'none'
  }
};
