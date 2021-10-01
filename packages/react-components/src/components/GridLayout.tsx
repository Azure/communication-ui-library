// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import React, { useRef, useEffect, useState } from 'react';
import { BaseCustomStylesProps } from '../types';
import { blockStyle, cellStyle, gridLayoutContainerStyle } from './styles/GridLayout.styles';
import { calculateBlockProps, chunkify } from './utils/GridLayoutUtils';

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

  const targetRef = useRef<HTMLDivElement>(null);
  const [blockProps, setBlockProps] = useState<BlockProps>({
    horizontal: true,
    numBlocks: Math.ceil(Math.sqrt(numberOfChildren))
  });

  useEffect(() => {
    const updateBlockProps = (): void => {
      if (targetRef.current) {
        setBlockProps(
          calculateBlockProps(numberOfChildren, targetRef.current.offsetWidth, targetRef.current.offsetHeight)
        );
      }
    };
    const observer = new ResizeObserver(updateBlockProps);
    if (targetRef.current) {
      observer.observe(targetRef.current);
    }
    updateBlockProps();
    return () => observer.disconnect();
  }, [numberOfChildren, targetRef.current?.offsetWidth, targetRef.current?.offsetHeight]);

  console.log(createBlocks);
  const blockPercent = (Math.floor(10000 / blockProps.numBlocks) / 100).toFixed(2);
  const blockSpace = (Math.floor(10000 / Math.ceil(numberOfChildren / blockProps.numBlocks)) / 100).toFixed(2);

  return (
    <div
      ref={targetRef}
      className={mergeStyles(
        gridLayoutContainerStyle,
        {
          div: blockProps.horizontal
            ? { height: `${blockPercent}%`, width: `${blockSpace}%` }
            : { height: `${blockSpace}%`, width: `${blockPercent}%` }
        },
        styles?.root
      )}
      style={{ display: 'flex', flexFlow: blockProps.horizontal ? 'row wrap' : 'column wrap' }}
    >
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

const createBlocks = (props: BlockProps & { children: React.ReactNode }): React.ReactNode => {
  const blocks: JSX.Element[] = [];
  // Get the percent of 1 block out of the total number of blocks rounded down.
  const blockPercent = (Math.floor(10000 / props.numBlocks) / 100).toFixed(2);
  // Split array of children into as even chunks
  const chunks = chunkify(React.Children.toArray(props.children), props.numBlocks);
  for (let i = 0; i < props.numBlocks; i++) {
    // Create block for i-th chunk children
    const block = createBlock(props.horizontal, `block-${i}`, `${blockPercent}%`, chunks[i]);
    // Add block to blocks
    blocks.push(block);
  }
  return blocks;
};

const createBlock = (
  horizontal: boolean,
  key: string,
  blockPercent: string,
  children: React.ReactNode
): JSX.Element => {
  const numberOfChildren = React.Children.count(children);
  return (
    <div
      key={key}
      className={blockStyle}
      style={
        horizontal
          ? {
              gridTemplateColumns: `repeat(${numberOfChildren}, 1fr)`,
              width: '100%',
              height: blockPercent
            }
          : {
              gridTemplateRows: `repeat(${numberOfChildren}, minmax(0, 1fr))`,
              width: blockPercent,
              height: '100%',
              float: 'left'
            }
      }
    >
      {React.Children.toArray(children).map((child, i) => (
        <div key={`${key}-cell-${i}`} className={cellStyle}>
          {child}
        </div>
      ))}
    </div>
  );
};
