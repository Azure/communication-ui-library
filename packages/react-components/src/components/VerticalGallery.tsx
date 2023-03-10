// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, Icon, IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
/* @conditional-compile-remove(vertical-gallery) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(vertical-gallery) */
import { useIdentifiers } from '../identifiers';
import { useTheme } from '../theming';
import { BaseCustomStyles, VideoGalleryRemoteParticipant } from '../types';
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
 *
 * @beta
 */
export interface VerticalGalleryStyles extends BaseCustomStyles {
  /** Styles for each video tile in the vertical gallery */
  children?: IStyle;
  /** Styles for the verticalGallery control bar */
  controlBar?: VerticalGalleryControlBarStyles;
}

/**
 * Strings for localization of the vertical gallery.
 *
 * @beta
 */
export interface VerticalGalleryStrings {
  /** Aria label for the left page navigation button */
  leftNavButtonAriaLabel?: string;
  /** Aria label for the right page navigation button */
  rightNavButtonAriaLabel?: string;
}

/**
 * Styles for the control bar inside the VerticalGallery component
 *
 * @beta
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
  /** Remote participants in the vertical gallery */
  galleryParticipants: VideoGalleryRemoteParticipant[];
  /** Max number of children per page in the vertical Gallery */
  childrenPerPage: number;
  /** Styles to customize the vertical gallery */
  styles?: VerticalGalleryStyles;
  /** Max number of video streams allowed in the VerticalGallery */
  maxRemoteVideoStreams?: number;
  /** Render function for the video tiles */
  onRenderRemoteParticipant: (participant: VideoGalleryRemoteParticipant, isVideoParticipant?: boolean) => JSX.Element;
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
  const { styles, childrenPerPage, galleryParticipants, onRenderRemoteParticipant, maxRemoteVideoStreams } = props;

  const [page, setPage] = useState(1);
  const [buttonState, setButtonState] = useState<{ previous: boolean; next: boolean }>({ previous: true, next: true });

  /* @conditional-compile-remove(vertical-gallery) */
  const ids = useIdentifiers();

  let activeVideoStreams = 0;

  const numberOfChildren = galleryParticipants.length;
  const lastPage = Math.ceil(numberOfChildren / childrenPerPage);

  const paginatedChildren: VideoGalleryRemoteParticipant[][] = useMemo(() => {
    return bucketize(galleryParticipants, childrenPerPage);
  }, [galleryParticipants, childrenPerPage]);

  const firstIndexOfCurrentPage = (page - 1) * childrenPerPage;
  const clippedPage = firstIndexOfCurrentPage < numberOfChildren - 1 ? page : lastPage;
  const childrenOnCurrentPage = paginatedChildren[clippedPage - 1];

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

  const onPreviousButtonClick = (): void => {
    setPage(page - 1);
  };
  const onNextButtonClick = (): void => {
    setPage(page + 1);
  };

  if (page > lastPage && lastPage > 0) {
    setPage(lastPage);
  }

  useEffect(() => {
    if (page > 1 && page < lastPage && showButtons) {
      // we are somewhere in between first and last pages.
      setButtonState({ previous: false, next: false });
    } else if (page === 1 && showButtons) {
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
        {overflowGalleryTiles.map((child, i) => {
          return (
            <Stack.Item
              key={i}
              styles={childrenStyles}
              /* @conditional-compile-remove(vertical-gallery) */ data-ui-id={ids.verticalGalleryVideoTile}
            >
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
  /* @conditional-compile-remove(vertical-gallery) */
  const ids = useIdentifiers();

  /* @conditional-compile-remove(vertical-gallery) */
  const strings = useLocale().strings.VerticalGallery;

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
        /* @conditional-compile-remove(vertical-gallery) */
        ariaLabel={strings.leftNavButtonAriaLabel}
        /* @conditional-compile-remove(vertical-gallery) */
        data-ui-id={ids.overflowGalleryLeftNavButton}
      >
        <Icon iconName="VerticalGalleryLeftButton" styles={navIconStyles} />
      </DefaultButton>
      <Text
        /* @conditional-compile-remove(vertical-gallery) */
        data-ui-id={ids.verticalGalleryPageCounter}
        className={pageCounterStyles}
      >{`${currentPage} / ${totalPages}`}</Text>
      <DefaultButton
        className={nextButtonsStyles}
        onClick={onNextButtonClick}
        disabled={buttonsDisabled?.next}
        /* @conditional-compile-remove(vertical-gallery) */
        ariaLabel={strings.rightNavButtonAriaLabel}
        /* @conditional-compile-remove(vertical-gallery) */
        data-ui-id={ids.overflowGalleryRightNavButton}
      >
        <Icon iconName="VerticalGalleryRightButton" styles={navIconStyles} />
      </DefaultButton>
    </Stack>
  );
};
