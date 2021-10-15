// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, IStyle, mergeStyles } from '@fluentui/react';
import React, { useMemo, useState } from 'react';
import { BaseCustomStylesProps } from '../../types';
import { horizontalGalleryContainerStyle, leftRightButtonStyles } from '../styles/HorizontalGallery.styles';

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
  hidePreviousButton?: boolean;
  hideNextButton?: boolean;
}

/**
 * Renders a horizontal gallery of video tiles.
 * @param props - HorizontalGalleryProps {@link @azure/communication-react#HorizontalGalleryProps}
 * @returns
 */
export const HorizontalGallery = (props: HorizontalGalleryProps): JSX.Element => {
  const { children, itemsPerPage = 1, styles, hidePreviousButton, hideNextButton } = props;

  const [page, setPage] = useState(0);

  const numberOfChildren = React.Children.count(children);
  const maxPageIndex = Math.ceil(numberOfChildren / itemsPerPage) - 1;

  const subArrayOfChildren = useMemo(() => {
    let start = page * itemsPerPage;
    if (start > numberOfChildren - 1) {
      setPage(Math.floor(numberOfChildren / itemsPerPage));
      start = page * itemsPerPage;
    }
    const end = start + itemsPerPage;
    return React.Children.toArray(children).slice(start, end);
  }, [page, itemsPerPage, children, numberOfChildren]);

  const showLeftButton = itemsPerPage > 0 && page > 0 && !hidePreviousButton;
  const showRightButton = itemsPerPage > 0 && page < maxPageIndex && !hideNextButton;

  return (
    <div className={mergeStyles(horizontalGalleryContainerStyle, props.styles?.root)}>
      {showLeftButton && (
        <PreviousButton styles={styles?.previousButton} onClick={() => setPage(Math.max(0, page - 1))} />
      )}
      {subArrayOfChildren}
      {showRightButton && (
        <NextButton styles={styles?.nextButton} onClick={() => setPage(Math.min(maxPageIndex, page + 1))} />
      )}
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
