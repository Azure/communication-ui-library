// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export type ContextualMenuItem = {
  key: string;
  text: string;
  onClick: (userId: string) => boolean | void;
};
