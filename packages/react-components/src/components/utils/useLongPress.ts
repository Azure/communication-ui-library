// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useRef, useState } from 'react';

/**
 * @private
 */
export default function useLongPress(
  onClick: () => void,
  onLongPress: () => void
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
    }, 500);
  }

  function handleOnClick(): void {
    onClick();
    if (isLongPress) {
      onLongPress();
      return;
    }
  }

  function handleOnKeyDown(): void {
    if (action) {
      setAction(false);
      startPressTimer();
    }
  }

  function handleOnKeyUp(): void {
    setAction(true);
    timerRef.current && clearTimeout(timerRef.current);
  }

  function handleOnMouseDown(): void {
    startPressTimer();
  }

  function handleOnMouseUp(): void {
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
