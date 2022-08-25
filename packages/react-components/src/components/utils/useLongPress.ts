// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useRef, useState } from 'react';

export default function useLongPress(onClick: () => void, onLongPress: () => void) {
  const [action, setAction] = useState('');
  const timerRef = useRef<NodeJS.Timeout>();
  const [isLongPress, setIsLongPress] = useState(false);

  function startPressTimer() {
    setIsLongPress(false);
    timerRef.current = setTimeout(() => {
      setIsLongPress(true);
      setAction('longpress');
    }, 500);
  }

  function handleOnClick() {
    onClick();
    if (isLongPress) {
      onLongPress();
      return;
    }
    setAction('click');
  }

  function handleOnKeyDown() {
    startPressTimer();
  }

  function handleOnKeyUp() {
    console.log('onkeyup');
    if (action === 'longpress') return;
    timerRef.current && clearTimeout(timerRef.current);
  }

  function handleOnMouseDown() {
    startPressTimer();
  }

  function handleOnMouseUp() {
    timerRef.current && clearTimeout(timerRef.current);
  }

  function handleOnTouchStart() {
    startPressTimer();
  }

  function handleOnTouchEnd() {
    if (action === 'longpress') return;
    timerRef.current && clearTimeout(timerRef.current);
  }

  return {
    action,
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
