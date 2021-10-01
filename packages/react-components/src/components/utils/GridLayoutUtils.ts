// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';

const TARGET_RATIO = 16 / 9;
const TOLERANCE_RATIO = 8 / 9;

const isRatioCloserThan = (A: number, B: number, targetRatio = TARGET_RATIO): boolean => {
  return Math.abs(targetRatio - A) < Math.abs(targetRatio - B);
};

type BlockProps = {
  horizontal: boolean;
  numBlocks: number;
};

const calculateBlockProps = (n: number, width: number, height: number): BlockProps => {
  if (width <= 0) {
    throw Error('Width provided [' + width + '] is less than or equal to 0.');
  } else if (height <= 0) {
    throw Error('Height provided [' + height + '] is less than or equal to 0.');
  }
  const aspectRatio = width / height;
  let rows = Math.floor(Math.sqrt((TARGET_RATIO * n) / aspectRatio));
  let cols = Math.ceil(n / rows);

  // Default blocks to be horizontal
  let horizontal = true;
  while (rows < n) {
    // If cell ratio is less than tolerance ratio then try more rows
    if ((rows / cols) * aspectRatio >= TOLERANCE_RATIO) {
      // If n is less than the total cells, we need to figure out whether the big cells should stretch horizontally or vertically
      // to fill in the empty spaces
      if (n < rows * cols) {
        // Calculate the width-to-height ratio of big cells stretched horizontally
        const horizontallyStretchedCellRatio = (rows / (cols - 1)) * aspectRatio;
        // Calculate the width-to-height ratio of big cells stretched vertically
        const verticallyStretchedCellRatio = ((rows - 1) / cols) * aspectRatio;
        // If vertically stretched cells pass the tolerance ratio then decide which ratio is better
        if (verticallyStretchedCellRatio >= TOLERANCE_RATIO) {
          horizontal = isRatioCloserThan(horizontallyStretchedCellRatio, verticallyStretchedCellRatio);
        }
      }
      break;
    }
    rows += 1;
    cols = Math.ceil(n / rows);
  }

  return { horizontal: horizontal, numBlocks: horizontal ? rows : cols };
};

const createGridStyles = (numberOfChildren: number, blockProps: BlockProps): string => {
  const maxCellsPerBlock = Math.ceil(numberOfChildren / blockProps.numBlocks);
  const minCellsPerBlock = Math.floor(numberOfChildren / blockProps.numBlocks);
  const numBigCells = (blockProps.numBlocks - (numberOfChildren % blockProps.numBlocks)) * minCellsPerBlock;
  const units = maxCellsPerBlock * minCellsPerBlock;

  const dynamicGridStyles: IStyle = mergeStyles(
    blockProps.horizontal
      ? {
          '> *': {
            gridColumn: `auto / span ${units / maxCellsPerBlock}`
          },
          gridTemplateColumns: `repeat(${units}, 1fr)`,
          gridTemplateRows: `repeat(${blockProps.numBlocks}, 1fr)`,
          gridAutoFlow: 'row'
        }
      : {
          '> *': {
            gridRow: `auto / span ${units / maxCellsPerBlock}`
          },
          gridTemplateColumns: `repeat(${blockProps.numBlocks}, 1fr)`,
          gridTemplateRows: `repeat(${units}, 1fr)`,
          gridAutoFlow: 'column'
        },
    maxCellsPerBlock !== minCellsPerBlock
      ? {
          [`> *:nth-last-child(-n + ${numBigCells})`]: blockProps.horizontal
            ? {
                gridColumn: `auto / span ${units / minCellsPerBlock}`
              }
            : {
                gridRow: `auto / span ${units / minCellsPerBlock}`
              }
        }
      : {}
  );
  return dynamicGridStyles;
};

/**
 * @private
 */
export const calculateGridStyles = (n: number, width: number, height: number): string => {
  return createGridStyles(n, calculateBlockProps(n, width, height));
};
