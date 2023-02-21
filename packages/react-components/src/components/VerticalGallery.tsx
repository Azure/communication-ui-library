// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
import React, { useMemo, useState } from 'react';
import { BaseCustomStyles } from '../types';
import { childrenContainerStyle } from './styles/VerticalGallery.styles';

export interface VerticalGalleryStyles extends BaseCustomStyles {
  /** Styles for each video tile in the vertical gallery */
  children?: IStyle;
  /** Styles for the previous button in the verticalGallery control bar */
  controlBar?: VerticalGalleryControlBarStyles;
}

export interface VerticalGalleryControlBarStyles extends BaseCustomStyles {
  /**
   * styles for the next button in the VerticalGalleryControlBar
   */
  nextButton?: IStyle;
  /**
   * Styles for the previous button in the VerticalGalleryControlBar
   */
  previousButton?: IStyle;
  /**
   * Styles for the counter in the VerticalGalleryControlBar
   */
  counter?: IStyle;
}
/**
 * Props for the VerticalGallery component
 *
 * @beta
 */
export interface VerticalGalleryProps {
  /** Video tiles for the remote participants in the vertical gallery */
  children: React.ReactNode;
  /** Max number of children per page in the vertical Gallery */
  childrenPerPage: number;
  /** Styles to customize the vertical gallery */
  styles?: VerticalGalleryStyles;
}

interface VerticalGalleryControlBarProps {
  onNextButtonClick?: () => void;
  onPreviousButtonClick?: () => void;
  buttonsDisabled?: { next: boolean; previous: boolean };
  totalPages?: number;
  styles?: VerticalGalleryControlBarStyles;
}

/**
 * VerticalGallery is a overflow gallery for participants in the {@link VideoGallery} component. Stacks
 * participants on the Y-axis of the VideoGallery for better use of horizontal space.
 *
 * @beta
 */
export const VerticalGallery = (props: VerticalGalleryProps): JSX.Element => {
  const { children, styles, childrenPerPage } = props;

  const [page, setPage] = useState(0);

  const numberOfChildren = React.Children.count(children);
  const lastPage = Math.ceil(numberOfChildren / childrenPerPage) - 1;

  const paginatedChildren: React.ReactNode[][] = useMemo(() => {
    return bucketize(React.Children.toArray(children), childrenPerPage);
  }, [children, childrenPerPage]);

  return (
    <Stack>
      <Stack className={mergeStyles(childrenContainerStyle, { '> *': props.styles?.children })}>{children}</Stack>
      <VerticalGalleryControlBar></VerticalGalleryControlBar>
    </Stack>
  );
};

const VerticalGalleryControlBar = (props: VerticalGalleryControlBarProps): JSX.Element => {
  return (
    <Stack horizontal>
      <DefaultButton></DefaultButton>
      <Text></Text>
      <DefaultButton></DefaultButton>
    </Stack>
  );
};

function bucketize<T>(arr: T[], bucketSize: number): T[][] {
  const bucketArray: T[][] = [];

  if (bucketSize <= 0) {
    return bucketArray;
  }

  for (let i = 0; i < arr.length; i += bucketSize) {
    bucketArray.push(arr.slice(i, i + bucketSize));
  }

  return bucketArray;
}
