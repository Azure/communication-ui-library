// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, DefaultButton, Icon, IStyle, Stack, mergeStyles } from '@fluentui/react';
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
  const theme = useTheme();

  const [page, setPage] = useState(0);

  const numberOfChildren = React.Children.count(children);
  const lastPage = Math.ceil(numberOfChildren / childrenPerPage) - 1;

  const subArrayOfChildren = useMemo(() => {
    const numberOfChildren = React.Children.count(children);
    let start = page * childrenPerPage;
    // Check if start is greater than the last child index. If yes, set page to last page.
    if (start > numberOfChildren - 1) {
      setPage(lastPage);
      start = page * childrenPerPage;
    }
    const end = start + childrenPerPage;
    return React.Children.toArray(children).slice(start, end);
  }, [page, childrenPerPage, lastPage, children]);

  // If children per page is 0 or less return empty element
  if (childrenPerPage <= 0) {
    return <></>;
  }

  const disablePreviousButton = page === 0;
  const disableNextButton = page === lastPage;

  const borderStyles = {
    border: `1px solid ${theme.palette.neutralLight}`,
    borderRadius: theme.effects.roundedCorner4
  };
  const previousButtonStyles = concatStyleSets(borderStyles, styles?.previousButton) as IStyle;
  const nextButtonStyles = concatStyleSets(borderStyles, styles?.nextButton) as IStyle;

  return (
    <Stack horizontal className={mergeStyles(horizontalGalleryContainerStyle, props.styles?.root)}>
      <PreviousButton
        styles={previousButtonStyles}
        onClick={() => setPage(Math.max(0, page - 1))}
        disabled={disablePreviousButton}
      />
      {subArrayOfChildren}
      <NextButton
        styles={nextButtonStyles}
        onClick={() => setPage(Math.min(lastPage, page + 1))}
        disabled={disableNextButton}
      />
    </Stack>
  );
};

const PreviousButton = (props: { styles: IStyle; onClick?: () => void; disabled?: boolean }): JSX.Element => {
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles)}
      onClick={props.onClick}
      disabled={props.disabled}
      styles={{ root: props.styles }}
    >
      <Icon iconName="HorizontalGalleryLeftButton" />
    </DefaultButton>
  );
};

const NextButton = (props: { styles: IStyle; onClick?: () => void; disabled?: boolean }): JSX.Element => {
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles)}
      onClick={props.onClick}
      disabled={props.disabled}
      styles={{ root: props.styles }}
    >
      <Icon iconName="HorizontalGalleryRightButton" />
    </DefaultButton>
  );
};
