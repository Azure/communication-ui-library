// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../theming';
import { BaseCustomStyles } from '../types';
import {
  childrenContainerStyle,
  pageNavigationControlBarContainerStyle,
  participantPageCounter,
  leftRightButtonStyles,
  navIconStyles,
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

  const childContainerStyle = useMemo(() => {
    return { root: childrenContainerStyle(2) };
  }, []);

  const childrenStyles = useMemo(() => {
    return { root: styles?.children };
  }, [styles?.children]);

  if (childrenPerPage <= 0) {
    return <></>;
  }

  return (
    <Stack className={mergeStyles(rootStyle, styles?.root)}>
      <Stack styles={childContainerStyle}>
        {childrenOnCurrentPage.map((child, i) => {
          return (
            <Stack.Item key={i} styles={childrenStyles}>
              {child}
            </Stack.Item>
          );
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

  const pageCounterContainerStyles = useMemo(() => {
    return mergeStyles(pageNavigationControlBarContainerStyle, styles?.root);
  }, [styles?.root]);

  const previousButtonSyles = useMemo(() => {
    return mergeStyles(leftRightButtonStyles(theme), styles?.previousButton);
  }, [styles?.previousButton, theme]);

  const pageCounterStyles = useMemo(() => {
    return mergeStyles(participantPageCounter, styles?.counter);
  }, [styles?.counter]);

  const nextButtonsStyles = useMemo(() => {
    return mergeStyles(leftRightButtonStyles(theme), styles?.nextButton);
  }, [styles?.nextButton, theme]);

  const controlBarSpacing = { childrenGap: '0.5rem' };

  return (
    <Stack horizontalAlign="center" tokens={controlBarSpacing} horizontal className={pageCounterContainerStyles}>
      <DefaultButton
        className={previousButtonSyles}
        onClick={onPreviousButtonClick}
        disabled={buttonsDisabled?.previous}
      >
        <Icon iconName="VerticalGalleryLeftButton" styles={navIconStyles} />
      </DefaultButton>
      <Text className={pageCounterStyles}>{`${currentPage} / ${totalPages}`}</Text>
      <DefaultButton className={nextButtonsStyles} onClick={onNextButtonClick} disabled={buttonsDisabled?.next}>
        <Icon iconName="VerticalGalleryRightButton" styles={navIconStyles} />
      </DefaultButton>
    </Stack>
  );
};
