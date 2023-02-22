// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../theming';
import { BaseCustomStyles } from '../types';
import {
  childrenContainerStyle,
  controlBarContainerStyle,
  leftRightButtonStyles,
  rootStyle
} from './styles/VerticalGallery.styles';
import { bucketize } from './utils/overFlowGalleriesUtils';

/**
 * Styles for the VerticalGallery component
 */
export interface VerticalGalleryStyles extends BaseCustomStyles {
  /** Styles for each video tile in the vertical gallery */
  children?: IStyle;
  /** Styles for the verticalGallery control bar */
  controlBar?: VerticalGalleryControlBarStyles;
}

/**
 * Styles for the control bar inside the VerticalGallery component
 */
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
  onNextButtonClick: () => void;
  onPreviousButtonClick: () => void;
  buttonsDisabled: { next: boolean; previous: boolean };
  totalPages: number;
  currentPage: number;
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
  const [buttonState, setButtonState] = useState<{ previous: boolean; next: boolean }>({ previous: true, next: true });

  const numberOfChildren = React.Children.count(children);
  const lastPage = Math.ceil(numberOfChildren / childrenPerPage) - 1;

  const paginatedChildren: React.ReactNode[][] = useMemo(() => {
    return bucketize(React.Children.toArray(children), childrenPerPage);
  }, [children, childrenPerPage]);

  const firstIndexOfCurrentPage = page * childrenPerPage;
  const clippedPage = firstIndexOfCurrentPage < numberOfChildren - 1 ? page : lastPage;
  const childrenOnCurrentPage = paginatedChildren[clippedPage];

  const showButtons = numberOfChildren > childrenPerPage;

  const onPreviousButtonClick = (): void => {
    setPage(page - 1);
  };
  const onNextButtonClick = (): void => {
    setPage(page + 1);
  };

  useEffect(() => {
    if (page > 0 && page < lastPage && showButtons) {
      // we are somewhere in between first and last pages.
      setButtonState({ previous: false, next: false });
    } else if (page === 0 && showButtons) {
      // we are on the first page.
      setButtonState({ previous: true, next: false });
    } else if (page === lastPage && showButtons) {
      // we are on the last page.
      setButtonState({ previous: false, next: true });
    }
  }, [page, numberOfChildren, lastPage, showButtons]);

  if (childrenPerPage <= 0) {
    return <></>;
  }

  return (
    <Stack className={mergeStyles(rootStyle, styles?.root)}>
      <Stack styles={{ root: childrenContainerStyle }}>
        {childrenOnCurrentPage.map((child) => {
          return <Stack.Item styles={{ root: styles?.children }}>{child}</Stack.Item>;
        })}
      </Stack>
      {showButtons && (
        <VerticalGalleryControlBar
          buttonsDisabled={buttonState}
          onPreviousButtonClick={onPreviousButtonClick}
          onNextButtonClick={onNextButtonClick}
          totalPages={lastPage}
          currentPage={page}
        />
      )}
    </Stack>
  );
};

const VerticalGalleryControlBar = (props: VerticalGalleryControlBarProps): JSX.Element => {
  const { onNextButtonClick, onPreviousButtonClick, buttonsDisabled, currentPage, totalPages, styles } = props;
  const theme = useTheme();
  return (
    <Stack horizontal className={mergeStyles(controlBarContainerStyle, styles?.root)}>
      <DefaultButton
        className={mergeStyles(leftRightButtonStyles(theme), styles?.previousButton)}
        onClick={onPreviousButtonClick}
        disabled={buttonsDisabled?.previous}
        styles={{ root: styles?.previousButton }}
      >
        <Icon iconName="VerticalGalleryLeftButton" />
      </DefaultButton>
      <Text>{`${currentPage} / ${totalPages}`}</Text>
      <DefaultButton
        className={mergeStyles(leftRightButtonStyles(theme), styles?.nextButton)}
        onClick={onNextButtonClick}
        disabled={buttonsDisabled?.next}
        styles={{ root: styles?.nextButton }}
      >
        <Icon iconName="VerticalGalleryRightButton" />
      </DefaultButton>
    </Stack>
  );
};
