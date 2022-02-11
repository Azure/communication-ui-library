// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * For keyboard navigation - when this component has active focus, enter key and space keys should have the same behavior as mouse click.
 *
 * @private
 */
export const submitWithKeyboard = (e: React.KeyboardEvent<HTMLElement>, onSubmit: () => void): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    onSubmit();
  }
};
