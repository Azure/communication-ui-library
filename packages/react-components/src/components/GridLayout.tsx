// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import React, { useState } from 'react';
import { BaseCustomStylesProps } from '../types';
import { gridLayoutStyle } from './styles/GridLayout.styles';

/**
 * Preset layouts for {@link GridLayout}.
 *
 * @public
 */
export type GridLayoutType = 'standard';

/**
 * Props for {@link GridLayout}.
 *
 * @public
 */
export interface GridLayoutProps {
  children: React.ReactNode;
  layout?: GridLayoutType;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <GridLayout styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
}

const calculateStandardLayoutRows = (numberOfItems: number, gridCol: number): number =>
  Math.ceil(numberOfItems / gridCol);

const calculateStandardLayoutColumns = (numberOfItems: number): number =>
  numberOfItems > 0 ? Math.ceil(Math.sqrt(numberOfItems)) : 1;

/**
 * A component to lay out audio / video tiles in a call.
 *
 * @public
 */
export const GridLayout = (props: GridLayoutProps): JSX.Element => {
  const [gridCol, setGridCol] = useState(1);
  const [gridRow, setGridRow] = useState(1);

  const { children, layout = 'standard', styles } = props;
  const numberOfChildren = React.Children.count(children);

  switch (layout) {
    case 'standard': {
      const numberOfColumns = calculateStandardLayoutColumns(numberOfChildren);
      if (gridCol !== numberOfColumns) setGridCol(numberOfColumns);
      const numberOfRows = calculateStandardLayoutRows(numberOfChildren, gridCol);
      if (gridRow !== numberOfRows) setGridRow(numberOfRows);
      break;
    }
  }

  return (
    <div
      className={mergeStyles(gridLayoutStyle, styles?.root)}
      style={{
        gridTemplateRows: `repeat(${gridRow}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${gridCol}, 1fr)`
      }}
    >
      {children}
    </div>
  );
};
