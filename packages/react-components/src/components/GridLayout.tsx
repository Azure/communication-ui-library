// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
import React, { useRef, useEffect, useState } from 'react';
import { BaseCustomStylesProps } from '../types';
import { gridLayoutStyle } from './styles/GridLayout.styles';
import { calculateGridProps, GridProps, createGridStyles } from './utils/GridLayoutUtils';

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
    horizontalFill: true,
    rows: Math.ceil(Math.sqrt(numberOfChildren)),
    columns: Math.ceil(Math.sqrt(numberOfChildren))
  });

  useEffect(() => {
    const updateDynamicGridStyles = (): void => {
      if (containerRef.current) {
        setGridProps(
          calculateGridProps(numberOfChildren, containerRef.current.offsetWidth, containerRef.current.offsetHeight)
        );
      }
    };
    const observer = new ResizeObserver(updateDynamicGridStyles);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    updateDynamicGridStyles();
    return () => observer.disconnect();
  }, [numberOfChildren, containerRef.current?.offsetWidth, containerRef.current?.offsetHeight]);

  const dynamicGridStyles = createGridStyles(numberOfChildren, gridProps);

  return (
    <div ref={containerRef} className={mergeStyles(gridLayoutStyle, dynamicGridStyles, styles?.root)}>
      {children}
    </div>
  );
};
