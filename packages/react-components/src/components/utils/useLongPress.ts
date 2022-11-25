// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useMemo, useRef, useState, useCallback, useEffect } from 'react';

/**
 * @private
 */
export default function useLongPress(
  onClick: () => void,
  onLongPress: () => void,
  touchEventsOnly: boolean
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

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onClick, onLongPress, touchEventsOnly]);

  const startPressTimer = useCallback(() => {
    setIsLongPress(false);
    timerRef.current = setTimeout(() => {
      setIsLongPress(true);
      onLongPress();
    }, 500);
  }, [onLongPress]);

  const handleOnClick = useCallback(() => {
    if (touchEventsOnly) {
      return;
    }
    if (!isLongPress) {
      onClick();
    }
  }, [isLongPress, onClick, touchEventsOnly]);

  const handleOnKeyDown = useCallback(() => {
    if (touchEventsOnly) {
      return;
    }
    if (action) {
      setAction(false);
      startPressTimer();
    }
  }, [action, startPressTimer, touchEventsOnly]);

  const handleOnKeyUp = useCallback(() => {
    if (touchEventsOnly) {
      return;
    }
    setAction(true);
    timerRef.current && clearTimeout(timerRef.current);
  }, [touchEventsOnly]);

  const handleOnMouseDown = useCallback(() => {
    if (touchEventsOnly) {
      return;
    }
    startPressTimer();
  }, [startPressTimer, touchEventsOnly]);

  const handleOnMouseUp = useCallback(() => {
    if (touchEventsOnly) {
      return;
    }
    timerRef.current && clearTimeout(timerRef.current);
  }, [touchEventsOnly]);

  const handleOnTouchStart = useCallback(() => {
    startPressTimer();
  }, [startPressTimer]);

  const handleOnTouchEnd = useCallback(() => {
    timerRef.current && clearTimeout(timerRef.current);
  }, []);

  return useMemo(
    () => ({
      handlers: {
        onClick: handleOnClick,
        onMouseDown: handleOnMouseDown,
        onMouseUp: handleOnMouseUp,
        onTouchStart: handleOnTouchStart,
        onTouchEnd: handleOnTouchEnd,
        onKeyDown: handleOnKeyDown,
        onKeyUp: handleOnKeyUp
      }
    }),
    [
      handleOnClick,
      handleOnKeyDown,
      handleOnKeyUp,
      handleOnMouseDown,
      handleOnMouseUp,
      handleOnTouchEnd,
      handleOnTouchStart
    ]
  );
}
