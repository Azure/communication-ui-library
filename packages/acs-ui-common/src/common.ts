// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @internal
 * Converts units of rem to units of pixels
 * @param rem - units of rem
 * @returns units of pixels
 */
export const _convertRemToPx = (rem: number): number => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

/**
 * @internal
 * Disable dismiss on resize to work around a couple Fluent UI bugs
 * - The Callout is dismissed whenever *any child of window (inclusive)* is resized. In practice, this
 * happens when we change the VideoGallery layout, or even when the video stream element is internally resized
 * by the headless SDK.
 * - We also want to prevent dismiss when chat pane is scrolling especially a new message is added.
 * A side effect of this workaround is that the context menu stays open when window is resized, and may
 * get detached from original target visually. That bug is preferable to the bug when this value is not set -
 * The Callout (frequently) gets dismissed automatically.
 */
export const _preventDismissOnEvent = (
  ev: Event | React.FocusEvent | React.KeyboardEvent | React.MouseEvent
): boolean => {
  return ev.type === 'resize' || ev.type === 'scroll';
};
