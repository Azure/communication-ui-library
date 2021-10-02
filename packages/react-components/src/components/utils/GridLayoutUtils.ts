// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

const TARGET_CELL_RATIO = 16 / 9;
const CELL_RATIO_TOLERANCE = 8 / 9;

const isCloserThan = (A: number, B: number, target: number): boolean => {
  return Math.abs(target - A) < Math.abs(target - B);
};

/**
 * Properties to describe a grid. The number of blocks and whether the blocks flow horizontally or vertically.
 *
 * @Example
 * ```
 *  ______________________
 * |_______|_______|______|
 * |___________|__________| This grid flows horizontally and has 2 blocks.
 *  ______________
 * |    |    |    |
 * |____|____|    |
 * |    |    |    |
 * |____|____|____| This grid flows vertically and has 3 blocks.
 *  _______________
 * |       |       |
 * |_______|_______|
 * |       |       |
 * |_______|_______| If all cells are equal, we default the flow as horizontal. This grid flows horizontally with 2 blocks.
 * ```
 */
export type GridProps = {
  horizontalFlow: boolean;
  numBlocks: number;
};

/**
 * Get the best GridProps to place a number of items in a grid as evenly as possible given the width and height of the grid
 * @param numberOfItems - number of items to place in grid
 * @param width - width of grid
 * @param height - height of grid
 * @returns GridProps
 */
export const calculateGridProps = (numberOfItems: number, width: number, height: number): GridProps => {
  if (numberOfItems <= 0 || width <= 0 || height <= 0) {
    return { horizontalFlow: true, numBlocks: 0 };
  }
  const aspectRatio = width / height;
  // Approximate how many rows to divide the grid to achieve cells close to the TARGET_CELL_RATIO
  let rows = Math.floor(Math.sqrt((TARGET_CELL_RATIO / aspectRatio) * numberOfItems)) ?? 1;
  // Given the rows, get the minimum columns needed to create enough cells for the number of items
  let cols = Math.ceil(numberOfItems / rows);

  // Default blocks to flow horizontal
  let horizontalFlow = true;

  while (rows < numberOfItems) {
    // If cell ratio is less than CELL_RATIO_TOLERANCE then try more rows
    if ((rows / cols) * aspectRatio >= CELL_RATIO_TOLERANCE) {
      // If n is less than the total cells, we need to figure out whether the big cells should stretch horizontally or vertically
      // to fill in the empty spaces
      // e.g. For 2 rows, 3 columns, but only 5 items, we need to choose whether to stetch cells
      //       horizontally            or           vertically
      //  ______________________               _______________________
      // |       |       |      |             |       |       |       |
      // |_______|_______|______|             |_______|_______|       |
      // |           |          |             |       |       |       |
      // |___________|__________|             |_______|_______|_______|
      if (numberOfItems < rows * cols) {
        // Calculate the width-to-height ratio of big cells stretched horizontally
        const horizontallyStretchedCellRatio = (rows / (cols - 1)) * aspectRatio;
        // Calculate the width-to-height ratio of big cells stretched vertically
        const verticallyStretchedCellRatio = ((rows - 1) / cols) * aspectRatio;
        // We know the horizontally stretched cells is higher than CELL_RATIO_TOLERANCE. If vertically stretched cells is also higher than
        // the CELL_TOLERANCE_RATIO, then choose which ratio is better.
        if (verticallyStretchedCellRatio >= CELL_RATIO_TOLERANCE) {
          // If vertically stetched cell has a ratio closer to TARGET_CELL_RATIO then change the flow to vertical
          if (isCloserThan(verticallyStretchedCellRatio, horizontallyStretchedCellRatio, TARGET_CELL_RATIO)) {
            horizontalFlow = false;
          }
        }
      }
      break;
    }
    rows += 1;
    cols = Math.ceil(numberOfItems / rows);
  }

  return { horizontalFlow, numBlocks: horizontalFlow ? rows : cols };
};

/**
 * Creates a styles class with CSS Grid related styles given GridProps and the number of items to distribute as evenly as possible.
 * @param numberOfItems - number of items to place in grid
 * @param gridProps - GridProps to define flow and number of blocks to distribute items
 * @returns
 */
export const createGridStyles = (numberOfItems: number, gridProps: GridProps): string => {
  const smallCellsPerBlock = Math.ceil(numberOfItems / gridProps.numBlocks);
  const bigCellsPerBlock = Math.floor(numberOfItems / gridProps.numBlocks);
  const numBigCells = (gridProps.numBlocks - (numberOfItems % gridProps.numBlocks)) * bigCellsPerBlock;
  // Get grid units
  // e.g. If some blocks have 2 big cells while others have 3 small cells, we need to work with 6 units per block
  const units = smallCellsPerBlock * bigCellsPerBlock;

  const gridStyles = gridProps.horizontalFlow
    ? {
        gridTemplateColumns: `repeat(${units}, 1fr)`,
        gridTemplateRows: `repeat(${gridProps.numBlocks}, 1fr)`,
        gridAutoFlow: 'row'
      }
    : {
        gridTemplateColumns: `repeat(${gridProps.numBlocks}, 1fr)`,
        gridTemplateRows: `repeat(${units}, 1fr)`,
        gridAutoFlow: 'column'
      };

  const smallCellStyle = gridProps.horizontalFlow
    ? {
        '> *': {
          gridColumn: `auto / span ${units / smallCellsPerBlock}`
        }
      }
    : {
        '> *': {
          gridRow: `auto / span ${units / smallCellsPerBlock}`
        }
      };

  // If there are big cells, we are choosing to place the latest children into the big cells.
  // Hence, the '> *:nth-last-child(-n + ${numBigCells})' CSS selector
  const bigCellStyle = numBigCells
    ? {
        [`> *:nth-last-child(-n + ${numBigCells})`]: gridProps.horizontalFlow
          ? {
              gridColumn: `auto / span ${units / bigCellsPerBlock}`
            }
          : {
              gridRow: `auto / span ${units / bigCellsPerBlock}`
            }
      }
    : {};

  const gridAndCellStyles: string = mergeStyles(gridStyles, smallCellStyle, bigCellStyle);
  return gridAndCellStyles;
};
