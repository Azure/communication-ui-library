// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, IStyle, Stack, mergeStyles } from '@fluentui/react';
import React, { useMemo, useState } from 'react';
import { useTheme } from '../theming';
import { BaseCustomStyles, VideoGalleryRemoteParticipant } from '../types';
import { rootStyle, childrenContainerStyle, leftRightButtonStyles } from './styles/HorizontalGallery.styles';
import { useIdentifiers } from '../identifiers';
import { bucketize } from './utils/overFlowGalleriesUtils';

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
  galleryParticipants: VideoGalleryRemoteParticipant[];
  onRenderRemoteParticipant: (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => JSX.Element;
  maxRemoteVideoStreams?: number;
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
  const {
    galleryParticipants,
    childrenPerPage = DEFAULT_CHILDREN_PER_PAGE,
    styles,
    onRenderRemoteParticipant,
    maxRemoteVideoStreams
  } = props;

  const ids = useIdentifiers();

  const [page, setPage] = useState(0);

  let activeVideoStreams = 0;

  const numberOfChildren = galleryParticipants.length;
  const lastPage = Math.ceil(numberOfChildren / childrenPerPage) - 1;

  const paginatedChildren: VideoGalleryRemoteParticipant[][] = useMemo(() => {
    return bucketize(galleryParticipants, childrenPerPage);
  }, [galleryParticipants, childrenPerPage]);

  // If children per page is 0 or less return empty element
  if (childrenPerPage <= 0) {
    return <></>;
  }

  const firstIndexOfCurrentPage = page * childrenPerPage;
  const clippedPage = firstIndexOfCurrentPage < numberOfChildren - 1 ? page : lastPage;
  const childrenOnCurrentPage = paginatedChildren[clippedPage];

  const overflowGalleryTiles =
    childrenOnCurrentPage &&
    childrenOnCurrentPage.map((p) => {
      return onRenderRemoteParticipant(
        p,
        maxRemoteVideoStreams && maxRemoteVideoStreams >= 0
          ? p.videoStream?.isAvailable && activeVideoStreams++ < maxRemoteVideoStreams
          : false
      );
    });

  const showButtons = numberOfChildren > childrenPerPage;
  const disablePreviousButton = page === 0;
  const disableNextButton = page === lastPage;

  return (
    <Stack horizontal className={mergeStyles(rootStyle, props.styles?.root)}>
      {showButtons && (
        <HorizontalGalleryNavigationButton
          key="previous-nav-button"
          icon={<Icon iconName="HorizontalGalleryLeftButton" />}
          styles={styles?.previousButton}
          onClick={() => setPage(Math.max(0, Math.min(lastPage, page - 1)))}
          disabled={disablePreviousButton}
          identifier={ids.overflowGalleryLeftNavButton}
        />
      )}
      <Stack horizontal className={mergeStyles(childrenContainerStyle, { '> *': props.styles?.children })}>
        {overflowGalleryTiles}
      </Stack>
      {showButtons && (
        <HorizontalGalleryNavigationButton
          key="next-nav-button"
          icon={<Icon iconName="HorizontalGalleryRightButton" />}
          styles={styles?.nextButton}
          onClick={() => setPage(Math.min(lastPage, page + 1))}
          disabled={disableNextButton}
          identifier={ids.overflowGalleryRightNavButton}
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
  identifier?: string;
}): JSX.Element => {
  const theme = useTheme();
  return (
    <DefaultButton
      className={mergeStyles(leftRightButtonStyles(theme), props.styles)}
      onClick={props.onClick}
      disabled={props.disabled}
      data-ui-id={props.identifier}
    >
      {props.icon}
    </DefaultButton>
  );
};
