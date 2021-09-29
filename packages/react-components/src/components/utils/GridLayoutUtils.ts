// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { BlockProps } from '../GridLayout';

const TARGET_RATIO = 16 / 9;
const TOLERANCE_RATIO = 0.9;

const isRatioBetterThan = (A: number, B: number, targetRatio?: number): boolean => {
  const _targetRatio = targetRatio ?? TARGET_RATIO;
  return Math.abs(_targetRatio - A) < Math.abs(_targetRatio - B);
};

/**
 * @private
 */
export const calculateBlockProps = (n: number, width: number, height: number): BlockProps => {
  if (width <= 0) {
    throw Error('Width provided [' + width + '] is less than or equal to 0.');
  } else if (height <= 0) {
    throw Error('Height provided [' + height + '] is less than or equal to 0.');
  }
  const areaRatio = width / height;
  let rows = Math.floor(Math.sqrt((TARGET_RATIO * n) / areaRatio));
  let cols = Math.ceil(n / rows);

  // Default blocks to be horizontal
  let horizontal = true;
  while (rows < n) {
    // If cell ratio is less than tolerance ratio and try more rows
    if ((rows / cols) * areaRatio >= TOLERANCE_RATIO) {
      // If n is less than the total cells, we need to figure out whether the big cells should stretch horizontally or vertically
      // to fill in the empty spaces
      if (n < rows * cols) {
        // Calculate the width-to-height ratio of big cells stretched horizontally
        const horizontallyStretchedCellRatio = (rows / (cols - 1)) * areaRatio;
        // Calculate the width-to-height ratio of big cells stretched vertically
        const verticallyStretchedCellRatio = ((rows - 1) / cols) * areaRatio;
        // If vertically stretched cells pass the tolerance ratio then decide which stretch is better
        if (verticallyStretchedCellRatio >= TOLERANCE_RATIO) {
          horizontal = isRatioBetterThan(horizontallyStretchedCellRatio, verticallyStretchedCellRatio);
        }
      }
      break;
    }
    rows += 1;
    cols = Math.ceil(n / rows);
  }

  return { horizontal: horizontal, numBlocks: horizontal ? rows : cols };
};

/**
 * @private
 */
export const getBlockProps = (n: number): BlockProps => {
  switch (n) {
    case 1:
      return { horizontal: true, numBlocks: 1 };
    case 2:
    case 3:
    case 4:
      return { horizontal: false, numBlocks: 2 };
    case 5:
    case 6:
      return { horizontal: true, numBlocks: 2 };
    default:
      return { horizontal: true, numBlocks: n };
  }
};
