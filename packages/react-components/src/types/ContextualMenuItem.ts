// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * `ContextualMenuItem` type represents a menu item for a participant in Chat or Calling
 */
export type ContextualMenuItem = {
  key: string;
  text: string;
  onClick: (userId: string) => void;
};
