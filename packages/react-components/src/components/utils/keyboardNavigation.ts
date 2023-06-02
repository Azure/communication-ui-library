// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * For keyboard navigation - when this component has active focus, enter key and space keys should have the same behavior as mouse click.
 *
 * @private
 */
export const submitWithKeyboard = (
  e: React.KeyboardEvent<HTMLElement>,
  onSubmit: (e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    onSubmit(e);
  }
};

/**
 * Determine if the press of the enter key is from a composition session or not (Safari only)
 *
 * @private
 */
export const isEnterKeyEventFromCompositionSession = (e: React.KeyboardEvent<HTMLElement>): boolean => {
  // Uses KeyCode 229 and which code 229 to determine if the press of the enter key is from a composition session or not (Safari only)
  if (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229 || e.nativeEvent.which === 229) {
    return true;
  } else {
    return false;
  }
};
