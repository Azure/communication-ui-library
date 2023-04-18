// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { BaseCustomStyles } from '../types';
import { gridLayoutStyle } from './styles/GridLayout.styles';

/**
 * Props for {@link GridLayout}.
 *
 * @public
 */
export interface GridLayoutProps {
  children: React.ReactNode;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <GridLayout styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStyles;
}

/**
 * {@link GridLayout} Component Styles.
 * @public
 */
export interface GridLayoutStyles extends BaseCustomStyles {
  /** Styles for each child of {@link GridLayout} */
  children?: IStyle;
}

/**
 * A component to lay out audio / video participants tiles in a call.
 *
 * @public
 */
export const GridLayout = (props: GridLayoutProps): JSX.Element => {
  const { children, styles } = props;
  const numberOfChildren = React.Children.count(children);

  const [currentWidth, setCurrentWidth] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const observer = useRef(
    new ResizeObserver((entries): void => {
      const { width, height } = entries[0].contentRect;
      setCurrentWidth(width);
      setCurrentHeight(height);
    })
  );

  useEffect(() => {
    if (containerRef.current) {
      observer.current.observe(containerRef.current);
    }
    const currentObserver = observer.current;
    return () => currentObserver.disconnect();
  }, [observer, containerRef]);

  const gridProps = useMemo(() => {
    return calculateGridProps(numberOfChildren, currentWidth, currentHeight);
  }, [numberOfChildren, currentWidth, currentHeight]);

  const cssGridStyles = useMemo(() => createGridStyles(numberOfChildren, gridProps), [numberOfChildren, gridProps]);

  return (
    <div
      ref={containerRef}
      className={mergeStyles(gridLayoutStyle, cssGridStyles, styles?.root)}
      data-ui-id="grid-layout"
    >
      {children}
    </div>
  );
};

/**
 * The cell aspect ratio we aim for in a grid
 */
const TARGET_CELL_ASPECT_RATIO = 16 / 9;
/**
 * The minimum cell aspect ratio we allow
 */
const MINIMUM_CELL_ASPECT_RATIO_ALLOWED = 8 / 9;

const isCloserThan = (a: number, b: number, target: number): boolean => {
  return Math.abs(target - a) < Math.abs(target - b);
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
 * |       |       | If all cells are equal, we default the fill direction as horizontal.
 * |_______|_______| This grid has 2 rows, 2 columns and fills horizontally.
 * ```
 */
type GridProps = {
  fillDirection: FillDirection;
  rows: number;
  columns: number;
};

type FillDirection = 'horizontal' | 'vertical';

/**
 * Get the best GridProps to place a number of items in a grid as evenly as possible given the width and height of the grid
 * @param numberOfItems - number of items to place in grid
 * @param width - width of grid
 * @param height - height of grid
 * @returns GridProps
 */
export const calculateGridProps = (numberOfItems: number, width: number, height: number): GridProps => {
  if (numberOfItems <= 0) {
    return { fillDirection: 'horizontal', rows: 0, columns: 0 };
  }
  // If width or height are 0 then we return rows and column evenly
  if (width <= 0 || height <= 0) {
    return {
      fillDirection: 'horizontal',
      rows: Math.ceil(Math.sqrt(numberOfItems)),
      columns: Math.ceil(Math.sqrt(numberOfItems))
    };
  }
  const aspectRatio = width / height;
  // Approximate how many rows to divide the grid to achieve cells close to the TARGET_CELL_ASPECT_RATIO
  let rows = Math.floor(Math.sqrt((TARGET_CELL_ASPECT_RATIO / aspectRatio) * numberOfItems)) || 1;
  // Make sure rows do not exceed numberOfItems
  rows = Math.min(rows, numberOfItems);
  // Given the rows, get the minimum columns needed to create enough cells for the number of items
  let columns = Math.ceil(numberOfItems / rows);

  // Default fill direction to horizontal
  let fillDirection: 'horizontal' | 'vertical' = 'horizontal';

  while (rows < numberOfItems) {
    // If cell aspect ratio is less than MINIMUM_CELL_ASPECT_RATIO_ALLOWED then try more rows
    if ((rows / columns) * aspectRatio < MINIMUM_CELL_ASPECT_RATIO_ALLOWED) {
      rows += 1;
      columns = Math.ceil(numberOfItems / rows);
      continue;
    }
    if (numberOfItems < rows * columns) {
      // We need to check that stretching columns vertically will result in only one less cell in stretched columns.
      // Likewise, we need to check that stretching rows horizonally will result in only one less cell in stretched rows.
      // e.g. For 4 rows, 2 columns, but only 6 items, we cannot stretch vertically because that would result in a
      // column of 2 cells which is less by more than 1 compared to the unstretched column.
      //  _________
      // |____|    |
      // |____|____|
      // |____|    |
      // |____|____|

      const canStretchVertically = numberOfItems >= rows + (columns - 1) * (rows - 1);
      const canStretchHorizontally = numberOfItems >= columns + (rows - 1) * (columns - 1);
      if (!canStretchVertically && !canStretchHorizontally) {
        rows += 1;
        columns = Math.ceil(numberOfItems / rows);
        continue;
      } else if (!canStretchVertically) {
        break;
      } else if (!canStretchHorizontally) {
        fillDirection = 'vertical';
        break;
      }

      // We need to figure out whether the big cells should stretch horizontally or vertically
      // to fill in the empty spaces
      // e.g. For 2 rows, 3 columns, but only 5 items, we need to choose whether to stretch cells
      //       horizontally            or           vertically
      //  ______________________               _______________________
      // |       |       |      |             |       |       |       |
      // |_______|_______|______|             |_______|_______|       |
      // |           |          |             |       |       |       |
      // |___________|__________|             |_______|_______|_______|

      // Calculate the aspect ratio of big cells stretched horizontally
      const horizontallyStretchedCellRatio = (rows / (columns - 1)) * aspectRatio;
      // Calculate the aspect ratio of big cells stretched vertically
      const verticallyStretchedCellRatio = ((rows - 1) / columns) * aspectRatio;
      // We know the horizontally stretched cells aspect ratio is higher than MINIMUM_CELL_ASPECT_RATIO_ALLOWED. If vertically stretched cells
      // is also higher than the MINIMUM_CELL_ASPECT_RATIO_ALLOWED, then choose which aspect ratio is better.
      if (verticallyStretchedCellRatio >= MINIMUM_CELL_ASPECT_RATIO_ALLOWED) {
        // If vertically stetched cell has an aspect ratio closer to TARGET_CELL_ASPECT_RATIO then change the fill direction to vertical
        if (isCloserThan(verticallyStretchedCellRatio, horizontallyStretchedCellRatio, TARGET_CELL_ASPECT_RATIO)) {
          fillDirection = 'vertical';
        }
      }
    }
    break;
  }

  return { fillDirection, rows, columns };
};

/**
 * Creates a styles classname with CSS Grid related styles given GridProps and the number of items to distribute as evenly as possible.
 * @param numberOfItems - number of items to place in grid
 * @param gridProps - GridProps that define the number of rows, number of columns, and the fill direction
 * @returns - classname
 */
export const createGridStyles = (numberOfItems: number, gridProps: GridProps): string => {
  const isHorizontal = gridProps.fillDirection === 'horizontal';
  // Blocks are either rows or columns depending on whether we fill horizontally or vertically. Each block may differ in the number of cells.
  const blocks = isHorizontal ? gridProps.rows : gridProps.columns;
  const smallCellsPerBlock = Math.ceil(numberOfItems / blocks);
  const bigCellsPerBlock = Math.floor(numberOfItems / blocks);
  const numBigCells = (gridProps.rows * gridProps.columns - numberOfItems) * bigCellsPerBlock;
  // Get grid units
  // e.g. If some blocks have 2 big cells while others have 3 small cells, we need to work with 6 units per block
  const units = smallCellsPerBlock * bigCellsPerBlock;

  const gridStyles = isHorizontal
    ? {
        gridTemplateColumns: `repeat(${units}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${blocks}, minmax(0, 1fr))`,
        gridAutoFlow: 'row'
      }
    : {
        gridTemplateColumns: `repeat(${blocks}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${units}, minmax(0, 1fr))`,
        gridAutoFlow: 'column'
      };

  const smallCellStyle = isHorizontal
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
  // That is why we use the '> *:nth-last-child(-n + ${numBigCells})' CSS selector below
  const bigCellStyle = numBigCells
    ? {
        [`> *:nth-last-child(-n + ${numBigCells})`]: isHorizontal
          ? {
              gridColumn: `auto / span ${units / bigCellsPerBlock}`
            }
          : {
              gridRow: `auto / span ${units / bigCellsPerBlock}`
            }
      }
    : {};

  return mergeStyles(gridStyles, smallCellStyle, bigCellStyle);
};
