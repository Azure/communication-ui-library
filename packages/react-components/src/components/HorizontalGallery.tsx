// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, DefaultButton, Icon, IStyle, mergeStyles } from '@fluentui/react';
import React, { useMemo, useState } from 'react';
import { useTheme } from '../theming';
import { BaseCustomStylesProps } from '../types';
import { horizontalGalleryContainerStyle, leftRightButtonStyles } from './styles/HorizontalGallery.styles';

/**
 * HorizontalGallery Component Styles.
 */
export interface HorizontalGalleryStyles extends BaseCustomStylesProps {
  previousButton?: IStyle;
  nextButton?: IStyle;
}

/**
 * HorizontalGallery Component Props.
 */
export interface HorizontalGalleryProps {
  children: React.ReactNode;
  styles?: HorizontalGalleryStyles;
  itemsPerPage?: number;
}

/**
 * Renders a horizontal gallery containing children.
 * @param props - HorizontalGalleryProps {@link @azure/communication-react#HorizontalGalleryProps}
 * @returns
 */
export const HorizontalGallery = (props: HorizontalGalleryProps): JSX.Element => {
  const { children, itemsPerPage = 1, styles } = props;

  const [page, setPage] = useState(0);

  const numberOfChildren = React.Children.count(children);
  const lastPage = Math.ceil(numberOfChildren / itemsPerPage) - 1;

  const subArrayOfChildren = useMemo(() => {
    const numberOfChildren = React.Children.count(children);
    let start = page * itemsPerPage;
    // Check if start is greater than the last child index. If yes, set page to last page.
    if (start > numberOfChildren - 1) {
      setPage(lastPage);
      start = page * itemsPerPage;
    }
    const end = start + itemsPerPage;
    return React.Children.toArray(children).slice(start, end);
  }, [page, itemsPerPage, lastPage, children]);

  const showPreviousButton = itemsPerPage > 0 && page > 0;
  const showNextButton = itemsPerPage > 0 && page < lastPage;

  const theme = useTheme();
  const borderStyles = {
    border: `1px solid ${theme.palette.neutralLight}`,
    borderRadius: theme.effects.roundedCorner4
  };
  const previousButtonStyles = concatStyleSets(borderStyles, styles?.previousButton) as IStyle;
  const nextButtonStyles = concatStyleSets(borderStyles, styles?.nextButton) as IStyle;

  return (
    <div className={mergeStyles(horizontalGalleryContainerStyle, props.styles?.root)}>
      {showPreviousButton && (
        <PreviousButton styles={previousButtonStyles} onClick={() => setPage(Math.max(0, page - 1))} />
      )}
      {subArrayOfChildren}
      {showNextButton && <NextButton styles={nextButtonStyles} onClick={() => setPage(Math.min(lastPage, page + 1))} />}
    </div>
  );
};

const PreviousButton = (props: { styles: IStyle; onClick?: () => void }): JSX.Element => {
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles)}
      onClick={props.onClick}
      styles={{ root: props.styles }}
    >
      <Icon iconName="HorizontalGalleryLeftButton" />
    </DefaultButton>
  );
};

const NextButton = (props: { styles: IStyle; onClick?: () => void }): JSX.Element => {
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles)}
      onClick={props.onClick}
      styles={{ root: props.styles }}
    >
      <Icon iconName="HorizontalGalleryRightButton" />
    </DefaultButton>
  );
};
