// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import React from 'react';
import { BaseCustomStylesProps } from '../types';
import { blockStyle, cellStyle, gridLayoutContainerStyle } from './styles/GridLayout.styles';
import { SizeMe } from 'react-sizeme';
import { calculateBlockProps } from './utils/GridLayoutUtils';

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
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <GridLayout styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
}

export const GridLayout = (props: GridLayoutProps): JSX.Element => {
  const { children, styles } = props;
  const numberOfChildren = React.Children.count(children);

  return (
    <SizeMe monitorHeight refreshRate={32}>
      {({ size }) => {
        let blockProps: BlockProps = { horizontal: true, numBlocks: Math.ceil(Math.sqrt(numberOfChildren)) };
        if (size.width && size.height) {
          blockProps = calculateBlockProps(numberOfChildren, size.width, size.height);
        }
        return (
          <div className={mergeStyles(gridLayoutContainerStyle, styles?.root)}>
            {renderBlocks({ ...blockProps, children })}
          </div>
        );
      }}
    </SizeMe>
  );
};

export type BlockProps = {
  horizontal: boolean;
  numBlocks: number;
};

const renderBlocks = (props: BlockProps & { children: React.ReactNode }): React.ReactNode => {
  const numberOfChildren = React.Children.count(props.children);
  let current = 0;
  const blockPercent = (Math.floor(10000 / props.numBlocks) / 100).toFixed(2);
  const blocks: JSX.Element[] = [];
  for (let i = 0; i < props.numBlocks; i++) {
    const numChildrenInBlock = Math.ceil((numberOfChildren - current) / (props.numBlocks - i));
    blocks.push(
      <div
        key={`block-${i}`}
        className={blockStyle}
        style={
          props.horizontal
            ? {
                gridTemplateColumns: `repeat(${numChildrenInBlock}, 1fr)`,
                width: '100%',
                height: `${blockPercent}%`
              }
            : {
                gridTemplateRows: `repeat(${numChildrenInBlock}, minmax(0, 1fr))`,
                width: `${blockPercent}%`,
                height: '100%',
                float: 'left'
              }
        }
      >
        {React.Children.toArray(props.children)
          .slice(current, current + numChildrenInBlock)
          .map((c, j) => (
            <div key={`cell-${i}-${j}`} className={cellStyle}>
              {c}
            </div>
          ))}
      </div>
    );
    current = current + numChildrenInBlock;
  }
  return blocks;
};
