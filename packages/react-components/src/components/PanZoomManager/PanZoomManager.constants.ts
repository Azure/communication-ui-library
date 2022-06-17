// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { LayoutTransformation } from './PanZoomManager.types';

/** default panning distance in pixels */
export const DEFAULT_PAN_DISTANCE = 20;

/** available zoom levels as a pct */
export const ZOOM_LEVELS = [100, 120, 145, 170, 200];

/** full width and height as a pct */
export const FULL_SIZE = 100;

/** min number of available transformations properties needed */
export const MIN_EXISTING_TRANSFORMATION_STYLES = 2;

/** default transformation */
export const DEFAULT_TRANSFORMATION = '50% 50% 0';

/** Transformation factors as numbers */
export const DEFAULT_TRANSFORMATION_OBJECT: LayoutTransformation = {
  transformOriginX: 50,
  transformOriginY: 50,
  scale: 1
};
