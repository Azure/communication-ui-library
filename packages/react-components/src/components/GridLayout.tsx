// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { BaseCustomStylesProps } from '../types';
import { gridLayoutStyle, gridStyle } from './styles/GridLayout.styles';

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
  styles?: BaseCustomStylesProps;
}

/**
 * A component to lay out audio / video participants tiles in a call.
 *
 * @public
 */
export const GridLayout = (props: GridLayoutProps): JSX.Element => {
  const { children, styles } = props;
  const numberOfChildren = React.Children.count(children);

  const containerRef = useRef<HTMLDivElement>(null);
  const [gridProps, setGridProps] = useState<GridProps>({
    fillDirection: 'horizontal',
    rows: Math.ceil(Math.sqrt(numberOfChildren)),
    columns: Math.ceil(Math.sqrt(numberOfChildren))
  });

  useEffect(() => {
    const updateGridProps = (): void => {
      if (containerRef.current) {
        setGridProps(
          calculateGridProps(numberOfChildren, containerRef.current.offsetWidth, containerRef.current.offsetHeight)
        );
      }
    };
    const observer = new ResizeObserver(updateGridProps);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    updateGridProps();
    return () => observer.disconnect();
  }, [numberOfChildren, containerRef.current?.offsetWidth, containerRef.current?.offsetHeight]);

  return (
    <div ref={containerRef} className={mergeStyles(gridLayoutStyle, styles?.root)}>
      <BiGrid gridProps={gridProps}>{children}</BiGrid>
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
  fillDirection: 'horizontal' | 'vertical';
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
    return { fillDirection: 'horizontal', rows: 0, columns: 0 };
  }
  const aspectRatio = width / height;
  // Approximate how many rows to divide the grid to achieve cells close to the TARGET_CELL_ASPECT_RATIO
  let rows = Math.floor(Math.sqrt((TARGET_CELL_ASPECT_RATIO / aspectRatio) * numberOfItems)) || 1;
  // Make sure rows do not exceed numberOfItems
  rows = Math.min(rows, numberOfItems);
  // Given the rows, get the minimum columns needed to create enough cells for the number of items
  let columns = Math.ceil(numberOfItems / rows);

  // Default fill dIrection to horizontal
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
      // e.g. For 4 rows, 2 columns, but only 6 items, we should not stretch vertically because that would result in a
      // column of 2 cells which is less by more than 1 compared to the unstretched column.
      //  _________
      // |____|    |
      // |____|____|
      // |____|    |
      // |____|____|

      const shouldStretchVertically = numberOfItems >= rows + (columns - 1) * (rows - 1);
      const shouldStretchHorizontally = numberOfItems >= columns + (rows - 1) * (columns - 1);
      if (!shouldStretchVertically && !shouldStretchHorizontally) {
        rows += 1;
        columns = Math.ceil(numberOfItems / rows);
        continue;
      } else if (!shouldStretchVertically) {
        break;
      } else if (!shouldStretchHorizontally) {
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
        // If vertically stetched cell has an apect ratio closer to TARGET_CELL_ASPECT_RATIO then change the fill direction to vertical
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
 * Grid that is made up of one or two grids. Based on the rows and columns from GridProps, if there are more cells than number of children then
 * there will be a second grid. The second grid will contain the larger cells to fill out the empty space. The first and second grid will be
 * top-and-bottom if fill direction from Grid Props is horizontal, otherwise they will be left-and-right.
 */
const BiGrid = (props: { children: React.ReactNode; gridProps: GridProps }): JSX.Element => {
  const gridProps = props.gridProps;
  const numberOfChildren = React.Children.count(props.children);

  const horizontalFill = gridProps.fillDirection === 'horizontal';
  // Blocks are either rows or columns depending on whether we fill horizontally or vertically. Each block may differ in the number of cells.
  const blocks = horizontalFill ? gridProps.rows : gridProps.columns;
  const smallCellsPerBlock = Math.ceil(numberOfChildren / blocks);
  const bigCellsPerBlock = Math.floor(numberOfChildren / blocks);
  const totalCells = gridProps.rows * gridProps.columns;
  const numBigCells = (totalCells - numberOfChildren) * bigCellsPerBlock;
  const numSmallCells = numberOfChildren - numBigCells;
  const blocksForBigCells = numBigCells / bigCellsPerBlock;
  const blocksForSmallCells = blocks - blocksForBigCells;

  const smallCellsGridStyles = useMemo(
    () =>
      horizontalFill
        ? {
            gridRow: `auto / span ${blocksForSmallCells}`,
            gridTemplateColumns: `repeat(${smallCellsPerBlock}, 1fr)`,
            gridTemplateRows: `repeat(${blocksForSmallCells}, 1fr)`
          }
        : {
            gridColumn: `auto / span ${blocksForSmallCells}`,
            gridTemplateRows: `repeat(${smallCellsPerBlock}, 1fr)`,
            gridTemplateColumns: `repeat(${blocksForSmallCells}, 1fr)`
          },
    [horizontalFill, blocksForSmallCells, smallCellsPerBlock]
  );

  const bigCellsGridStyles = useMemo(
    () =>
      numBigCells > 0
        ? horizontalFill
          ? {
              gridRow: `auto / span ${blocksForBigCells}`,
              gridTemplateColumns: `repeat(${bigCellsPerBlock}, 1fr)`,
              gridTemplateRows: `repeat(${blocksForBigCells}, 1fr)`
            }
          : {
              gridColumn: `auto / span ${blocksForBigCells}`,
              gridTemplateRows: `repeat(${bigCellsPerBlock}, 1fr)`,
              gridTemplateColumns: `repeat(${blocksForBigCells}, 1fr)`
            }
        : {},
    [numBigCells, horizontalFill, blocksForBigCells, bigCellsPerBlock]
  );

  const smallCellsGrid = (
    <div className={mergeStyles(gridStyle)} style={smallCellsGridStyles}>
      {React.Children.toArray(props.children).slice(0, numSmallCells)}
    </div>
  );
  const bigCellsGrid =
    numBigCells > 0 ? (
      <div className={mergeStyles(gridStyle)} style={bigCellsGridStyles}>
        {React.Children.toArray(props.children).slice(numSmallCells)}
      </div>
    ) : null;

  const mainGridStyles = useMemo(
    () =>
      horizontalFill
        ? { gridAutoFlow: 'column', gridTemplateRows: `repeat(${blocks}, 1fr)` }
        : { gridAutoFlow: 'row', gridTemplateColumns: `repeat(${blocks}, 1fr)` },
    [horizontalFill, blocks]
  );

  return (
    <div className={mergeStyles(gridStyle)} style={mainGridStyles}>
      {smallCellsGrid}
      {bigCellsGrid}
    </div>
  );
};
