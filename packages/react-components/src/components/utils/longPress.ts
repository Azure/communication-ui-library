// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// Number of milliseconds that indicates a press was a 'long press'.
// 400ms is the current Android long press time: https://android.googlesource.com/platform/packages/apps/Settings.git/+/06dfd7566/res/values/arrays.xml#731
// 500ms is the current iOS long press time: https://developer.apple.com/documentation/uikit/uilongpressgesturerecognizer/1616423-minimumpressduration
// However both iOS and Android allow customization of this behavior.
// We will default to 500ms and gather feedback on this value.
const LONG_PRESS_TIMEOUT_MS = 500;

// Cancel the long press on movement. If this is too aggressive this should be updated to detect
// if movement goes out of bounds of the element instead of cancelling on any movement.
const CANCEL_ON_MOVEMENT = true;

// Singleton that tracks whether there is an active touchstart event.
let longPressTimerHandle: number | undefined = undefined;

/**
 * Attach a long press event on an element.
 *
 * @remarks
 * This disables the context menu that would usually show on long touch in a mobile browser.
 * This is intentionally set to only work with touch events.
 * The long press is cancelled on movement.
 *
 * @returns The passed in element with the long press event attached.
 *
 * @private
 */
export function attachLongTouchPressEvent<T extends HTMLElement>(target: T, callback: () => void): void {
  const clearLongPressTimeout = (): void => {
    clearTimeout(longPressTimerHandle);
  };

  target.addEventListener('touchstart', (e) => {
    clearLongPressTimeout();
    longPressTimerHandle = window.setTimeout(() => {
      e.stopPropagation();
      callback();
    }, LONG_PRESS_TIMEOUT_MS);
  });

  // Do not trigger long press if touchend event ends before long press
  // timeout has completed.
  target.addEventListener('touchend', () => {
    clearLongPressTimeout();
  });

  // Do not trigger long press if touchmove event occurs before long press
  // timeout has completed. If this is too aggressive consider adding a
  // movement threshold or allow movement within the bound of the element.
  target.addEventListener('touchmove', () => {
    if (CANCEL_ON_MOVEMENT) {
      clearLongPressTimeout();
    }
  });

  // Disable context menu that would normally show on long press
  target.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}
