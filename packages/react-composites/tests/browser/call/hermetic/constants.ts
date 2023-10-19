// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Redeclare runtime values from the calling sdk package.
 * The calling sdk package makes reference to the window object at import time, so we can only
 * import types (not values) from that package.
 */
export enum DiagnosticQuality {
  Good = 1,
  Poor = 2,
  Bad = 3
}
