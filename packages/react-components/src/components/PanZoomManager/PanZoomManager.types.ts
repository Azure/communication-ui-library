// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/** @private */
export type Coordinate = { x: number; y: number };

/** @private */
export type LayoutTransformation = {
  transformOriginX: number;
  transformOriginY: number;
  scale: number;
};

/** @private */
export type RelativeTransformation = {
  /**
   * relative X transformation in %
   */
  relativeX: number;

  /**
   * relative Y transformation in %
   */
  relativeY: number;
};

/**
 * Available zoom actions
 * @private
 */
export enum ZoomAction {
  In,
  Out,
  Reset
}
