// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, IStyle, Stack, mergeStyles } from '@fluentui/react';
import React, { useMemo, useState } from 'react';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { BaseCustomStyles } from '../types';
import { rootStyle, childrenContainerStyle, leftRightButtonStyles } from './styles/HorizontalGallery.styles';

/**
 * {@link HorizontalGallery} default children per page
 */
const DEFAULT_CHILDREN_PER_PAGE = 5;

/**
 * {@link HorizontalGallery} Component Styles.
 * @public
 */
export interface HorizontalGalleryStyles extends BaseCustomStyles {
  /** Styles for each child of {@link HorizontalGallery} */
  children?: IStyle;
  /** Styles for navigation button to go to previous page */
  previousButton?: IStyle;
  /** Styles for navigation button to go to next page */
  nextButton?: IStyle;
}

/**
 * {@link HorizontalGallery} Component Props.
 */
export interface HorizontalGalleryProps {
  children: React.ReactNode;
  /**
   * Styles for HorizontalGallery
   */
  styles?: HorizontalGalleryStyles;
  /**
   * Children shown per page
   * @defaultValue 5
   */
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

  const localeStrings = useLocale().strings.videoGallery;

  const numberOfChildren = React.Children.count(children);
  const lastPage = Math.ceil(numberOfChildren / childrenPerPage) - 1;

  const paginatedChildren: React.ReactNode[][] = useMemo(() => {
    return bucketize(React.Children.toArray(children), childrenPerPage);
  }, [children, childrenPerPage]);

  // If children per page is 0 or less return empty element
  if (childrenPerPage <= 0) {
    return <></>;
  }

  const firstIndexOfCurrentPage = page * childrenPerPage;
  const clippedPage = firstIndexOfCurrentPage < numberOfChildren - 1 ? page : lastPage;
  const childrenOnCurrentPage = paginatedChildren[clippedPage];

  const showButtons = numberOfChildren > childrenPerPage;
  const disablePreviousButton = page === 0;
  const disableNextButton = page === lastPage;

  return (
    <Stack horizontal className={mergeStyles(rootStyle, props.styles?.root)}>
      {showButtons && (
        <HorizontalGalleryNavigationButton
          key="previous-nav-button"
          ariaLabel={localeStrings.previousNavButtonAriaLabel}
          icon={<Icon iconName="HorizontalGalleryLeftButton" />}
          styles={styles?.previousButton}
          onClick={() => setPage(Math.max(0, Math.min(lastPage, page - 1)))}
          disabled={disablePreviousButton}
        />
      )}
      <Stack horizontal className={mergeStyles(childrenContainerStyle, { '> *': props.styles?.children })}>
        {childrenOnCurrentPage}
      </Stack>
      {showButtons && (
        <HorizontalGalleryNavigationButton
          key="next-nav-button"
          ariaLabel={localeStrings.nextNavButtonAriaLabel}
          icon={<Icon iconName="HorizontalGalleryRightButton" />}
          styles={styles?.nextButton}
          onClick={() => setPage(Math.min(lastPage, page + 1))}
          disabled={disableNextButton}
        />
      )}
    </Stack>
  );
};

const HorizontalGalleryNavigationButton = (props: {
  icon: JSX.Element;
  styles: IStyle;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}): JSX.Element => {
  const theme = useTheme();
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles(theme), props.styles)}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={props.ariaLabel}
    >
      {props.icon}
    </DefaultButton>
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
