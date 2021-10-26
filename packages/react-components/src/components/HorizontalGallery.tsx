// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, IStyle, Stack, mergeStyles } from '@fluentui/react';
import React, { useMemo, useState } from 'react';
import { useTheme } from '../theming';
import { BaseCustomStylesProps } from '../types';
import { horizontalGalleryContainerStyle, leftRightButtonStyles } from './styles/HorizontalGallery.styles';

/**
 * {@link HorizontalGallery} default children per page
 */
const DEFAULT_CHILDREN_PER_PAGE = 5;

/**
 * {@link HorizontalGallery} Component Styles.
 */
export interface HorizontalGalleryStyles extends BaseCustomStylesProps {
  previousButton?: IStyle;
  nextButton?: IStyle;
}

/**
 * {@link HorizontalGallery} Component Props.
 */
export interface HorizontalGalleryProps {
  children: React.ReactNode;
  styles?: HorizontalGalleryStyles;
  childrenPerPage?: number;
}

/**
 * Renders a horizontal gallery that parents children horizontally. Handles pagination based on the childrenPerPage prop.
 * @param props - HorizontalGalleryProps {@link @azure/communication-react#HorizontalGalleryProps}
 * @returns
 */
export const HorizontalGallery = (props: HorizontalGalleryProps): JSX.Element => {
  const { children, childrenPerPage = DEFAULT_CHILDREN_PER_PAGE, styles } = props;

  const [page, setPage] = useState(0);

  const numberOfChildren = React.Children.count(children);
  const lastPage = Math.ceil(numberOfChildren / childrenPerPage) - 1;

  const paginatedChildren: React.ReactNode[][] = useMemo(() => {
    const paginatedChildren: React.ReactNode[][] = [];
    if (childrenPerPage <= 0) {
      return paginatedChildren;
    }
    for (let i = 0; i < Math.ceil(numberOfChildren / childrenPerPage); i++) {
      paginatedChildren.push(React.Children.toArray(children).slice(i * childrenPerPage, (i + 1) * childrenPerPage));
    }
    return paginatedChildren;
  }, [numberOfChildren, children, childrenPerPage]);

  // If children per page is 0 or less return empty element
  if (childrenPerPage <= 0) {
    return <></>;
  }

  const firstIndexOfCurrentPage = page * childrenPerPage;
  // Check if first index of current page is greater than the last child index. If yes, set page to last page.
  if (firstIndexOfCurrentPage > numberOfChildren - 1) {
    setPage(lastPage);
  }
  const childrenOnCurrentPage = paginatedChildren[page];

  const disablePreviousButton = page === 0;
  const disableNextButton = page === lastPage;

  return (
    <Stack horizontal className={mergeStyles(horizontalGalleryContainerStyle, props.styles?.root)}>
      <HorizontalGalleryNavigationButton
        icon={<Icon iconName="HorizontalGalleryLeftButton" />}
        styles={styles?.previousButton}
        onClick={() => setPage(Math.max(0, page - 1))}
        disabled={disablePreviousButton}
      />
      {childrenOnCurrentPage}
      <HorizontalGalleryNavigationButton
        icon={<Icon iconName="HorizontalGalleryRightButton" />}
        styles={styles?.nextButton}
        onClick={() => setPage(Math.min(lastPage, page + 1))}
        disabled={disableNextButton}
      />
    </Stack>
  );
};

const HorizontalGalleryNavigationButton = (props: {
  icon: JSX.Element;
  styles: IStyle;
  onClick?: () => void;
  disabled?: boolean;
}): JSX.Element => {
  const theme = useTheme();
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles(theme), props.styles)}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.icon}
    </DefaultButton>
  );
};
