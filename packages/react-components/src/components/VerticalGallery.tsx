// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';
import React from 'react';
import { BaseCustomStyles } from '../types';

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
  /** Styles to customize the vertical gallery */
  styles?: VerticalGalleryStyles;
  /** Max number of children per page in the vertical Gallery */
  childrenPerPage?: number;
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
  return <></>;
};

const VerticalGalleryControlBar = (props: VerticalGalleryControlBarProps): JSX.Element => {
  return <></>;
};
