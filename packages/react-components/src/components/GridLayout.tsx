// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles } from '@fluentui/react';
import React, { useRef, useEffect, useState } from 'react';
import { BaseCustomStylesProps } from '../types';
import { gridLayoutStyle } from './styles/GridLayout.styles';
import { calculateBlockProps } from './utils/GridLayoutUtils';

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
  const [blockProps, setBlockProps] = useState<BlockProps>({
    horizontal: true,
    numBlocks: Math.ceil(Math.sqrt(numberOfChildren))
  });

  useEffect(() => {
    const updateBlockProps = (): void => {
      if (containerRef.current) {
        setBlockProps(
          calculateBlockProps(numberOfChildren, containerRef.current.offsetWidth, containerRef.current.offsetHeight)
        );
      }
    };
    const observer = new ResizeObserver(updateBlockProps);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    updateBlockProps();
    return () => observer.disconnect();
  }, [numberOfChildren, containerRef.current?.offsetWidth, containerRef.current?.offsetHeight]);

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

  return (
    <div ref={containerRef} className={mergeStyles(gridLayoutStyle, dynamicGridStyles, styles?.root)}>
      {children}
    </div>
  );
};

/**
 * Props to create blocks for children in Grid Layout
 *
 */
export type BlockProps = {
  horizontal: boolean;
  numBlocks: number;
};
