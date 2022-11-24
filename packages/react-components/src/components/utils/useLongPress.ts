// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useRef, useState } from 'react';

/**
 * @private
 */
export default function useLongPress(
  onClick: () => void,
  onLongPress: () => void,
  isMobile: boolean
): {
  handlers: {
    onClick: () => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
    onKeyDown: () => void;
    onKeyUp: () => void;
  };
} {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const [isLongPress, setIsLongPress] = useState(false);
  const [action, setAction] = useState(false);

  function startPressTimer(): void {
    setIsLongPress(false);
    timerRef.current = setTimeout(() => {
      setIsLongPress(true);
      onLongPress();
    }, 500);
  }

  function handleOnClick(): void {
    if (isMobile) {
      return;
    }
    if (!isLongPress) {
      onClick();
    }
  }

  function handleOnKeyDown(): void {
    if (isMobile) {
      return;
    }
    if (action) {
      setAction(false);
      startPressTimer();
    }
  }

  function handleOnKeyUp(): void {
    if (isMobile) {
      return;
    }
    setAction(true);
    timerRef.current && clearTimeout(timerRef.current);
  }

  function handleOnMouseDown(): void {
    if (isMobile) {
      return;
    }
    startPressTimer();
  }

  function handleOnMouseUp(): void {
    if (isMobile) {
      return;
    }
    timerRef.current && clearTimeout(timerRef.current);
  }

  function handleOnTouchStart(): void {
    startPressTimer();
  }

  function handleOnTouchEnd(): void {
    timerRef.current && clearTimeout(timerRef.current);
  }

  return {
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
      onKeyDown: handleOnKeyDown,
      onKeyUp: handleOnKeyUp
    }
  };
}
