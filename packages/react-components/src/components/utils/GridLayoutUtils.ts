// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * The cell ratio we aim for in a grid
 */
const TARGET_CELL_RATIO = 16 / 9;
/**
 * The minimum cell ratio in a grid we allow
 */
const MINIMUM_CELL_RATIO_ALLOWED = 8 / 9;

const isCloserThan = (A: number, B: number, target: number): boolean => {
  return Math.abs(target - A) < Math.abs(target - B);
};

/**
 * Properties to describe a grid. The number of rows, number of columns and whether it fills horizontally or vertically.
 *
 * @Example
 * ```
 *  ______________________
 * |_______|_______|______|
 * |___________|__________| This grid has 2 rows, 3 columns and fills horizontally.
 *  ______________
 * |    |    |    |
 * |____|____|    |
 * |    |    |    |
 * |____|____|____| This grid has 2 rows, 3 columns and fills vertically.
 *  _______________
 * |       |       |
 * |_______|_______|
 * |       |       |
 * |_______|_______| If all cells are equal, we default the fill as horizontal. This grid has 2 rows, 2 columns and fills horizontally.
 * ```
 */
export type GridProps = {
  horizontalFill: boolean;
  rows: number;
  columns: number;
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
    return { horizontalFill: true, rows: 0, columns: 0 };
  }
  const aspectRatio = width / height;
  // Approximate how many rows to divide the grid to achieve cells close to the TARGET_CELL_RATIO
  let rows = Math.floor(Math.sqrt((TARGET_CELL_RATIO / aspectRatio) * numberOfItems)) ?? 1;
  // Given the rows, get the minimum columns needed to create enough cells for the number of items
  let columns = Math.ceil(numberOfItems / rows);

  // Default horizontalFill to true
  let horizontalFill = true;

  while (rows < numberOfItems) {
    // If cell ratio is less than MINIMUM_CELL_RATIO_ALLOWED then try more rows
    if ((rows / columns) * aspectRatio >= MINIMUM_CELL_RATIO_ALLOWED) {
      // If n is less than the total cells, we need to figure out whether the big cells should stretch horizontally or vertically
      // to fill in the empty spaces
      // e.g. For 2 rows, 3 columns, but only 5 items, we need to choose whether to stetch cells
      //       horizontally            or           vertically
      //  ______________________               _______________________
      // |       |       |      |             |       |       |       |
      // |_______|_______|______|             |_______|_______|       |
      // |           |          |             |       |       |       |
      // |___________|__________|             |_______|_______|_______|
      if (numberOfItems < rows * columns) {
        // Calculate the width-to-height ratio of big cells stretched horizontally
        const horizontallyStretchedCellRatio = (rows / (columns - 1)) * aspectRatio;
        // Calculate the width-to-height ratio of big cells stretched vertically
        const verticallyStretchedCellRatio = ((rows - 1) / columns) * aspectRatio;
        // We know the horizontally stretched cells is higher than MINIMUM_CELL_RATIO_ALLOWED. If vertically stretched cells is also higher than
        // the MINIMUM_CELL_RATIO_ALLOWED, then choose which ratio is better.
        if (verticallyStretchedCellRatio >= MINIMUM_CELL_RATIO_ALLOWED) {
          // If vertically stetched cell has a ratio closer to TARGET_CELL_RATIO then change the flow to vertical
          if (isCloserThan(verticallyStretchedCellRatio, horizontallyStretchedCellRatio, TARGET_CELL_RATIO)) {
            horizontalFill = false;
          }
        }
      }
      break;
    }
    rows += 1;
    columns = Math.ceil(numberOfItems / rows);
  }

  return { horizontalFill, rows, columns };
};

/**
 * Creates a styles class with CSS Grid related styles given GridProps and the number of items to distribute as evenly as possible.
 * @param numberOfItems - number of items to place in grid
 * @param gridProps - GridProps that define the number of rows, number of columns, and the fill direction
 * @returns
 */
export const createGridStyles = (numberOfItems: number, gridProps: GridProps): string => {
  // Blocks are either rows or columns depending on whether we fill horizontally or vertically. Each block may differ in the number of cells.
  const blocks = gridProps.horizontalFill ? gridProps.rows : gridProps.columns;
  const smallCellsPerBlock = Math.ceil(numberOfItems / blocks);
  const bigCellsPerBlock = Math.floor(numberOfItems / blocks);
  const numBigCells = (blocks - (numberOfItems % blocks)) * bigCellsPerBlock;
  // Get grid units
  // e.g. If some blocks have 2 big cells while others have 3 small cells, we need to work with 6 units per block
  const units = smallCellsPerBlock * bigCellsPerBlock;

  const gridStyles = gridProps.horizontalFill
    ? {
        gridTemplateColumns: `repeat(${units}, 1fr)`,
        gridTemplateRows: `repeat(${blocks}, 1fr)`,
        gridAutoFlow: 'row'
      }
    : {
        gridTemplateColumns: `repeat(${blocks}, 1fr)`,
        gridTemplateRows: `repeat(${units}, 1fr)`,
        gridAutoFlow: 'column'
      };

  const smallCellStyle = gridProps.horizontalFill
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
        [`> *:nth-last-child(-n + ${numBigCells})`]: gridProps.horizontalFill
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
